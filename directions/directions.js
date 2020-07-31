export const createMapboxRequestParams = data => {
  let coordinates = '';
  let waypointNames = new Array(data.legs.length + 1);
  const waypoints = Array.from(Array(data.legs.length + 1).keys()).join(';');

  data.legs.forEach((leg, i) => {
    if (i === 0) {
      const [originLong, originLat] = leg.origin.geometry.coordinates;
      const [destinationLong, destinationLat] = leg.destination.geometry.coordinates;
      coordinates = `${originLong},${originLat};${destinationLong},${destinationLat}`;
      waypointNames[i] = '';
      return;
    }
    const [long, lat] = leg.destination.geometry.coordinates;
    coordinates = `${coordinates};${long},${lat}`;
    waypointNames[i] = i === data.legs.length + 1 ? '' : data.legs[i - 1].name;
  });

  return { coordinates, waypointNames: waypointNames.join(';'), waypoints };
};

export const createInstructions = async data => {
  const { coordinates, waypoints, waypointNames } = createMapboxRequestParams(data);

  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    body.append('coordinates', coordinates);
    body.append('steps', 'true');
    body.append('waypoints', waypoints);
    body.append('waypoint_names', waypointNames);
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving?access_token=pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg`,
      {
        method: 'POST',
        headers,
        body,
      },
    );
    const result = await response.json();

    // Create a string containing the HTML for the route instructions.
    let routeInstructions = '';
    result.routes[0].legs.forEach(({ steps }, i) => {
      const instructionsForStep = steps.reduce((acc, { maneuver, distance, geometry }, index) => {
        const listItem = `
        <li class="instruction-step">
            <p class="instruction-text">
              <span class="instruction-number">${index + 1}. </span>${maneuver.instruction}</p>
            <p class="instruction-distance">${renderDistance(distance)}</p>
        </li>`;
        return acc + listItem;
      }, `<h2>Directions to ${data.legs[i]?.name || 'next stop'}</h2>`);
      routeInstructions = routeInstructions + instructionsForStep;
    });

    // Add the routeInstructions to the instructions div.
    document.getElementById('instructions').innerHTML = `<ol>${routeInstructions}</ol>`;
  } catch (e) {
    console.log('Error', e);
  }
};

const renderDistance = distance => {
  if (!distance) return '';
  if (distance < 3000) {
    return `${Math.round(distance.toFixed(1))} m`;
  } else {
    return `${Math.round((distance / 1000).toFixed(1))} km`;
  }
};

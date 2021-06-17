import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 5.5,
  center: [9.1320104, 55.1758916],
});

/**
 * Draw route polyline and show the point of origin and destination on the map.
 * @param { array } coordinates - Array of coordinates.
 * @param { array } legs - stops -- each leg represents either a charging station, or via point or final point.
 */
export const drawRoute = (id, coordinates, legs) => {
  if (map.loaded()) {
    drawPolyline(coordinates);
    showLegs(legs);
  } else {
    map.on('load', () => {
      drawPolyline(coordinates);
      showLegs(legs);
    });
  }

  map.on('mouseenter', 'polyline', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'polyline', () => {
    map.getCanvas().style.cursor = '';
  });
};

/**
 * Draw route polyline on a map.
 * @param { array } coordinates - polyline coordinates
 */
const drawPolyline = coordinates => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          properties: {},
          coordinates,
        },
      },
    ],
  };

  map.addSource('polyline-source', {
    type: 'geojson',
    lineMetrics: true,
    data: geojson,
  });

  map.addLayer({
    id: 'polyline',
    type: 'line',
    options: 'beforeLayer',
    source: 'polyline-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#0078FF',
      'line-width': 3,
    },
  });
};

/**
 * Show the origin and destination on the map.
 * The destination of the last leg is the destination point.
 * The origin of the first leg is the origin of our route.
 * @param { array } legs - stops -- each leg represents either a charging station, or via point or final point
 */
const showLegs = legs => {
  if (!legs || legs.length === 0) return;
  let route = [];

  route.push({
    type: 'Feature',
    properties: {
      icon: 'location_big',
    },
    geometry: legs[0].origin?.geometry,
  });

  route.push({
    type: 'Feature',
    properties: {
      icon: 'arrival',
    },
    geometry: legs[legs.length - 1].destination?.geometry,
  });

  // draw origin and destination points on a map
  map.addLayer({
    id: 'route',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.9,
      'icon-offset': ['case', ['==', ['get', 'icon'], 'arrival'], ['literal', [0, -15]], ['literal', [0, 0]]],
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: route,
      },
    },
  });
};

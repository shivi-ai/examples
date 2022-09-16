import { getDurationString } from '../../../utils';

// Array used for journey overview.
let journeyLegs = [];
let wholeRouteContainsTolls = false;
let wholeRouteContainsFerries = false;

/**
 * Render journey overview.
 *
 * @param data {object} route specification
 */
export const renderRouteData = data => {
  // the total distance of the route, in meters converted to km
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';

  // the total energy used of the route, in kWh
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;

  // Enable or disable our border-crossing UI
  // document.getElementById('border-crossing').style.display = data.tags.includes('crossborder') ? 'flex' : 'none';

  let extraFerryStops = 0;
  let origin = '';
  let destination = '';
  // Convert the legs we receive from the API to journey overview legs we can display.
  // First check if the route has loaded yet
  if (data) {
    // Determine origin and destination
    origin = data.legs[0].origin.properties.name;
    destination = data.legs[data.legs.length - 1].destination.properties.name;
    // Go through the legs we receive from the backend - stations and final.
    for (let i = 0; i < data.legs.length; i++) {
      let ferrySteps = getNumberOfFerryStepsInLeg(data.legs[i]);
      // Used to determine number of stops, at top of journey overview details
      extraFerryStops += ferrySteps;
      // 'Regular' route, no ferry. Add route to station as a leg
      if (ferrySteps == 0) {
        // Check for tolls
        let tollsOnLeg = false;
        if (containsTolls(data.legs[i])) {
          tollsOnLeg = true;
        }
        // Station steps are split up into a drive to the station, followed by the charging info at the station
        if (data.legs[i].type === 'station') {
          journeyLegs.push({
            tollsOnLeg,
            rangeStartPercentage: data.legs[i].rangeStartPercentage,
            rangeEndPercentage: data.legs[i].rangeEndPercentage,
            type: 'pre-station',
            duration: data.legs[i].duration,
            distance: data.legs[i].distance,
          });
        }
        journeyLegs.push({
          ...data.legs[i],
          tollsOnLeg,
        });
      }
      // Leg contains ferry steps, so split it up
      else {
        splitLeg(data.legs[i]);
      }
    }
  }

  // the amount of stops in this route
  const routeStops = `${data.charges + extraFerryStops ?? 0} stops`;

  // A combined field containing several of the route meta data
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;

  // Populate journey overview
  if (journeyLegs) {
    // Show ferrys & tolls indicator if present on route
    document.getElementById('toll').innerHTML = `${displayFerriesAndTollsIndicator()}`;
    // Show start point
    document.getElementById('journey-timeline').innerHTML += `
    <div class="timeline-item timelineStartPoint start">
    <div class='icon timeline-icon timelineStartPoint start'></div>
    <div class='timeline-content'><p class='body-bold'>${origin}</p></div></div>`;
    // Go through journey legs, displaying each one in order
    for (let i = 0; i < journeyLegs.length; i++) {
      let instructions = '';
      let borderCrossingHTML = '';
      switch (journeyLegs[i].type) {
        case 'ferry':
          instructions = `
          <div class='timeline-item ferry'><div class="icon timeline-icon ferry"></div>
          <div class='timeline-content'><p class='title'>
          Ferry for ${(journeyLegs[i].distance / 1000).toFixed(1)} km</p></div>
          <div><p class='body-small metal'>Approx ${getDurationString(journeyLegs[i].duration)}</p></div></div>
          `;
          break;
        case 'station':
          instructions = `
          <div class='timeline-item station'>
          <div class="icon timeline-icon chargeTurbo station"></div><div class="timeline-content">
          <div class="station-title-container"><p class='title'>${journeyLegs[i].name}</p></div>
          <div class='station-info'><p class='body-small metal'>Range at arrival:</p><p>
          ${journeyLegs[i].rangeEndPercentage}%</p></div>
          <div class='station-info'><p class='body-small metal'>Available plugs:</p><p>
          ${journeyLegs[i].plugsAvailable}</p></div>
          <div class='station-info'><p class='body-small metal'>Charging time:</p><p>
          ${getDurationString(journeyLegs[i].chargeTime)}</p></div>
          <div class='station-info'><p class='body-small metal'>Range at departure:</p><p>
          ${journeyLegs[i + 1].rangeStartPercentage}%</p>
          </div></div></div>
          `;
          break;
        default:
          if (journeyLegs[i].tollsOnLeg) {
            borderCrossingHTML = `<span class='toll'><p> Toll roads</p></span>`;
          }
          instructions = `
          <div class='timeline-item vehicle'>
          <div class="icon timeline-icon vehicle"></div>
          <div class='timeline-content'>
          <div class='drive-title-container'>
          <p class='title'>Drive ${(journeyLegs[i].distance / 1000).toFixed(1)} km</p>${borderCrossingHTML}</div>
          <p class='body-small metal'>Approx ${getDurationString(journeyLegs[i].duration)}</p></div></div>
          `;
          break;
      }
      document.getElementById('journey-timeline').innerHTML += `${instructions}`;
    }
    // Show end point
    document.getElementById('journey-timeline').innerHTML += `<div class="timeline-item timelineDestination end">
    <div class="icon timeline-icon timelineDestination end"></div>
    <div class='timeline-content'>
    <p class='title'>${destination}</p></div></div>`;
  }
};

/**
 * Display ferries and tolls if present
 *
 * @return {string} html elements to render ferry/toll information
 */
function displayFerriesAndTollsIndicator() {
  let ferriesAndTollsIconsIndicator = ``;
  let ferriesAndTollsTextIndicator = ``;
  if (wholeRouteContainsTolls) {
    ferriesAndTollsIconsIndicator += `<span class="icon-toll"></span>`;
    ferriesAndTollsTextIndicator += ` Tolls | `;
  }
  if (wholeRouteContainsFerries) {
    ferriesAndTollsIconsIndicator += `<span class="icon-ferry"></span>`;
    ferriesAndTollsTextIndicator += `Ferry`;
  }
  return `${ferriesAndTollsIconsIndicator} 
  <h4 id="tolls-indicator"> ${ferriesAndTollsTextIndicator}</h4>`;
}

/**
 * Display checks if tolls are present on the leg
 *
 * @param leg
 * @return {boolean}
 */
function containsTolls(leg) {
  for (let i = 0; i < leg.steps.length; i++) {
    if (leg.steps[i].type === 'toll') {
      wholeRouteContainsTolls = true;
      return true;
    }
  }
  return false;
}

/**
 * Counts ferry steps present on the leg
 *
 * @param leg
 * @return {integer}
 */

function getNumberOfFerryStepsInLeg(leg) {
  let ferrysteps = 0;
  for (let i = 0; i < leg.steps.length; i++) {
    if (leg.steps[i].type === 'ferry') {
      wholeRouteContainsFerries = true;
      ferrysteps++;
    }
  }
  return ferrysteps;
}

/**
 * Splits the leg up around a ferry step.
 * Legs we receive from the API are split by station.
 * We will split them up further to display them on the journey overview, then add them to the array.
 * So a step for a drive, a step for a ferry and a step for a station.
 *
 * @param leg
 */

function splitLeg(leg) {
  let rollingDistance = 0;
  let rollingDuration = 0;
  let tollsOnLeg = false;
  for (let i = 0; i < leg.steps.length; i++) {
    // Check for tolls
    if (leg.steps[i].type === 'toll') {
      tollsOnLeg = true;
    }
    // Regular step, keep adding the distance & duration to display a combined 'pre-ferry' leg
    if (leg.steps[i].type !== 'ferry') {
      rollingDistance += leg.steps[i].distance;
      rollingDuration += leg.steps[i].duration;
    } else {
      // Push the combined steps as a leg for the 'pre-ferry' leg
      journeyLegs.push({
        origin: {
          properties: {
            name: leg.origin.properties.name,
          },
        },
        rangeEndPercentage: leg.rangeEndPercentage,
        rangeStartPercentage: leg.rangeStartPercentage,
        tollsOnLeg,
        type: 'pre-ferry',
        distance: rollingDistance,
        duration: rollingDuration,
      });
      // Reset rolling values in case there are more steps after the ferry
      rollingDistance = 0;
      rollingDuration = 0;
      // Add the ferry step as a leg
      journeyLegs.push({
        ...leg.steps[i],
        tollsOnLeg: false,
      });
      tollsOnLeg = false;
      if (i + 1 == leg.steps.length) return;
    }
  }
  // Add the final steps as a leg
  // Station steps are split up into a drive to the station, followed by the charging info at the station
  if (leg.type === 'station') {
    journeyLegs.push({
      type: 'pre-station',
      distance: rollingDistance,
      duration: rollingDuration,
      tollsOnLeg,
    });
  }
  journeyLegs.push({
    name: leg.name,
    chargeTime: leg.chargeTime,
    rangeStartPercentage: leg.rangeStartPercentage,
    rangeEndPercentage: leg.rangeEndPercentage,
    plugsAvailable: leg.plugsAvailable,
    stationId: leg.stationId,
    type: leg.type,
    distance: rollingDistance,
    duration: rollingDuration,
    tollsOnLeg,
  });
}

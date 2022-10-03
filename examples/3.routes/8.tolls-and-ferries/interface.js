import { getDurationString } from '../../../utils';

// Array used for journey overview.
let journeyLegs = [];

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

  // the amount of stops in this route
  const routeStops = `${data.charges ?? 0} stops`;

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;

  // A combined field containing several of the route meta data
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;

  let origin = '';
  let destination = '';
  // Convert the legs we receive from the API to journey overview legs we can display.
  // First check if the route has loaded yet
  if (data) {
    // Determine origin and destination
    origin = data.legs[0].origin.properties.name;
    destination = data.legs[data.legs.length - 1].destination.properties.name;
    // Split journey into legs
    journeyLegs = getJourneyLegs(data);
  }

  // Populate journey overview
  if (journeyLegs) {
    // Show ferrys & toll roads indicator if present on route
    document.getElementById('toll').innerHTML = `${displayFerriesAndTollsIndicator(data.tags)}`;
    // Show start point
    document.getElementById('journey-timeline').innerHTML += `
    <div class="timeline-item timelineStartPoint start">
      <div class='icon timeline-icon timelineStartPoint start'>
      </div>
      <div class='timeline-content'>
        <p class='body-bold'>${origin}</p>
      </div>
    </div>`;
    // Go through journey legs, displaying each one in order
    for (let i = 0; i < journeyLegs.length; i++) {
      let instructions = '';
      let tollsHTML = '';
      switch (journeyLegs[i].type) {
        case 'ferry':
          instructions = `
          <div class='timeline-item ferry'>
            <div class="icon timeline-icon ferry">
            </div>
            <div class='timeline-content'>
              <p class='title'>Ferry for ${(journeyLegs[i].distance / 1000).toFixed(1)} km</p>
            </div>
            <div>
              <p class='body-small metal'>Approx ${getDurationString(journeyLegs[i].duration)}</p>
            </div>
          </div>
          `;
          break;
        case 'station':
          instructions = `
          <div class='timeline-item station'>
            <div class="icon timeline-icon chargeTurbo station">
            </div>
            <div class="timeline-content">
              <div class="station-title-container">
                <p class='title'>${journeyLegs[i].name}</p>
              </div>
              <div class='station-info'>
                <p class='body-small metal'>Range at arrival:</p>
                <p>${journeyLegs[i].rangeEndPercentage}%</p>
              </div>
              <div class='station-info'>
                <p class='body-small metal'>Available plugs:</p>
                <p>${journeyLegs[i].plugsAvailable}</p>
              </div>
              <div class='station-info'>
                <p class='body-small metal'>Charging time:</p>
                <p>${getDurationString(journeyLegs[i].chargeTime)}</p>
              </div>
              <div class='station-info'>
                <p class='body-small metal'>Range at departure:</p>
                <p>${journeyLegs[i + 1].rangeStartPercentage}%</p>
              </div>
            </div>
          </div>
          `;
          break;
        default:
          if (journeyLegs[i].tollsOnLeg) {
            tollsHTML = `<span class='toll'><p> Toll roads</p></span>`;
          }
          instructions = `
          <div class='timeline-item vehicle'>
            <div class="icon timeline-icon vehicle">
            </div>
            <div class='timeline-content'>
              <div class='drive-title-container'>
                <p class='title'>Drive ${(journeyLegs[i].distance / 1000).toFixed(1)} km</p>
                ${tollsHTML}
              </div>
              <p class='body-small metal'>Approx ${getDurationString(journeyLegs[i].duration)}</p>
            </div>
          </div>
          `;
          break;
      }
      document.getElementById('journey-timeline').innerHTML += `${instructions}`;
    }
    // Show end point
    document.getElementById('journey-timeline').innerHTML += `
    <div class="timeline-item timelineDestination end">
      <div class="icon timeline-icon timelineDestination end">
      </div>
      <div class='timeline-content'>
        <p class='title'>${destination}</p>
      </div>
    </div>`;
  }
};

/**
 * Display ferries and toll roads if present
 *
 * @return {string} html elements to render ferry/toll information
 */
function displayFerriesAndTollsIndicator(routeTags) {
  return `<h4 id='tolls-indicator'>
    ${routeTags.includes('toll') ? "<span class='icon-toll'></span>Toll Roads" : ''}
    ${routeTags.includes('toll') && routeTags.includes('ferry') ? ' | ' : ''}
    ${routeTags.includes('ferry') ? "<span class='icon-ferry'></span>Ferry" : ''}
  </h4>
  `;
}

/**
 * Display ferries and toll roads if present
 *
 * @param data {object} data object containing whole route info
 * @return [] array of journey legs to display on the overview
 */
function getJourneyLegs(data) {
  return data.legs.reduce((legAcc, leg) => {
    var stepLegs = leg.steps.reduce((stepAcc, step) => {
      switch (step.type) {
        case 'ferry': {
          if (stepAcc[stepAcc.length - 1].type !== 'ferry') {
            stepAcc.push({
              type: 'ferry',
              distance: 0,
              duration: 0,
              tollsOnLeg: false,
            });
          }

          break;
        }
        default: {
          if (stepAcc.length === 0 || stepAcc[stepAcc.length - 1].type === 'ferry') {
            stepAcc.push({
              type: 'road',
              distance: 0,
              duration: 0,
              tollsOnLeg: false,
            });
          }

          break;
        }
      }

      // Include distance & duration, as well as toll roads
      stepAcc[stepAcc.length - 1].distance += step.distance;
      stepAcc[stepAcc.length - 1].duration += step.duration;
      stepAcc[stepAcc.length - 1].tollsOnLeg = stepAcc[stepAcc.length - 1].tollsOnLeg || step.type === 'toll';

      return stepAcc;
    }, []);
    stepLegs[0].origin = leg.origin;
    stepLegs[0].rangeStartPercentage = leg.rangeStartPercentage;
    stepLegs[stepLegs.length - 1].destination = leg.destination;
    stepLegs[stepLegs.length - 1].rangeEndPercentage = leg.rangeEndPercentage;

    // Adding the charging station or via as a Leg
    if (leg.type !== 'final') {
      stepLegs.push(leg);
    }

    legAcc.push(...stepLegs);

    return legAcc;
  }, []);
}

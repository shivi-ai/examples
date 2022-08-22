import { getDurationString } from '../../../utils';
import { hideAlternatives, showAlternatives } from './map';

let routeData;

/**
 * Function that renders the header details
 * @param { object } data - All available route data
 */
export const renderRouteHeader = data => {
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';
  const routeStops = `${data.charges ?? 0} stops`;
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;
};

/**
 * Small helper that attaches an event listener to the stations along route switch
 * @param { object } data - All available route data including stations along the route
 */
export const attachEventListeners = data => {
  routeData = data;
  document.getElementById('stations-along-route').addEventListener('input', didToggleSwitch);
};

const didToggleSwitch = event => {
  event.preventDefault();

  const numberOfStations = document.getElementById('number-of-stations');
  const alternatives = routeData.stationsAlongRoute ?? [];

  if (event.target.checked) {
    numberOfStations.innerHTML = alternatives.length;
    showAlternatives(alternatives);
  } else {
    numberOfStations.innerHTML = '-';
    hideAlternatives();
  }
};

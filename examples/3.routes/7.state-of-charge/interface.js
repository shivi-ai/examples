import { getRoute } from './client';
import { drawRoutePolyline } from './map';
import { getDurationString } from '../../../utils';

export const getStateOfCharge = () => {
  return document.getElementById('range').value;
};

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

export const renderErrorToast = () => {
  const errorToast = document.getElementById('error-toast');
  errorToast.style.transform = `translateY(0)`;

  setTimeout(() => {
    errorToast.style.transform = `translateY(100%)`;
  }, 3500);
};

export const attachEventListeners = () => {
  document.getElementById('range').addEventListener('input', didReleaseRangeSlider);
  document.getElementById('range').addEventListener('change', didUpdateRangeSlider);
};

/**
 * Update our current vehicle range based upon the slider value
 * @param { Event } event - Slider drag listener
 */
const didReleaseRangeSlider = event => {
  document.getElementById('vehicle-range').innerHTML = `${event.target.value} km`;
};

const didUpdateRangeSlider = event => {
  event.target.disabled = true;

  const loadingToast = document.getElementById('loading-toast');
  loadingToast.style.transform = `translateY(0)`;

  getRoute(event.target.value, routeData => {
    if (routeData) {
      drawRoutePolyline(routeData);
      renderRouteHeader(routeData);
    } else {
      renderErrorToast();
    }

    event.target.disabled = false;
    loadingToast.style.transform = `translateY(100%)`;
  });
};

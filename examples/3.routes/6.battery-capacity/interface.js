import { getRoute } from './client';
import { drawRoutePolyline } from './map';
import { getDurationString } from '../../../utils';

// This example uses a Tesla 75D (2016-2019). By default it has a useable battery capacity of 72.5 kWh and
// a Chargetrip best range of 389. These two values are interchangeable when adjusting the capacity.
// In a real application you would fetch these values on a per car basis using a car request.
// See our car example on how you would get these details; https://examples.chargetrip.com/?id=car-list
const usableBatteryCapacityInKWH = 72.5;
const chargetripBestRange = 389;

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
  }, 2500);
};

export const attachEventListeners = () => {
  document.getElementById('range').addEventListener('input', didUpdateRangeSlider, true);
  document.getElementById('range').addEventListener('change', didReleaseRangeSlider, true);
};

/**
 * Attach an event listener to our slider to update the current vehicle battery capacity
 */
const didUpdateRangeSlider = event => {
  event.preventDefault();
  const vehicleRange = document.getElementById('battery-capacity');

  const computedRangeInKM = chargetripBestRange + (chargetripBestRange / 100) * event.target.value;
  const formattedPercentage = `${event.target.value > 0 ? '+' + event.target.value : event.target.value}`;

  vehicleRange.innerHTML = `${formattedPercentage}% • ${parseInt(computedRangeInKM)}km`;
};

/**
 * Attach an event listener that updates our route with the new battery capacity on release
 */
const didReleaseRangeSlider = event => {
  event.preventDefault();
  event.target.disabled = true;

  const computedBatteryCapacity = getBatteryCapacity();
  const loadingToast = document.getElementById('loading-toast');

  loadingToast.style.transform = `translateY(0)`;

  getRoute(computedBatteryCapacity, routeData => {
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

/**
 * Computes new usableBatteryCapacity within the set bounds of -20% and +20%.
 * @returns - the usableBatteryCapacity
 */
export const getBatteryCapacity = () => {
  return usableBatteryCapacityInKWH + (usableBatteryCapacityInKWH / 100) * document.getElementById('range').value;
};

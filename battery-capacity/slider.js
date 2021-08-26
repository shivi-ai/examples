import { fetchRoute } from './client';
import { drawRoutePolyline } from './index';

const rangeSlider = document.getElementById('range');
const loadingToast = document.getElementById('loading-toast');
const errorToast = document.getElementById('error-toast');

// This example uses a Tesla 75D (2016-2019). By default it has a useable battery capacity of 72.5 kWh and
// a Chargetrip best range of 389. These two values are interchangeable when adjusting the capacity.
// In a real application you would fetch these values on a per car basis using a car request.
// See our car example on how you would get these details; https://examples.chargetrip.com/?id=car-list
const usableBatteryCapacityInKWH = 72.5;
const chargetripBestRange = 389;

/**
 * Attach an event listener to our slider to update the current vehicle battery capacity
 */
rangeSlider.addEventListener('input', e => {
  e.preventDefault();
  const vehicleRange = document.getElementById('battery-capacity');

  const computedRangeInKM = chargetripBestRange + (chargetripBestRange / 100) * rangeSlider.value;
  const formattedPercentage = `${rangeSlider.value > 0 ? '+' + rangeSlider.value : rangeSlider.value}`;

  vehicleRange.innerHTML = `${formattedPercentage}% • ${parseInt(computedRangeInKM)}km`;
});

/**
 * Attach an event listener that updates our route with the new battery capacity on release
 */
rangeSlider.addEventListener('change', e => {
  e.preventDefault();

  // Here we compute new usableBatteryCapacity within the set bounds of -20% and +20%.
  const computedBatteryCapacity = usableBatteryCapacityInKWH + (usableBatteryCapacityInKWH / 100) * rangeSlider.value;

  rangeSlider.disabled = true;
  loadingToast.style.transform = `translateY(0)`;

  // Fetch the route with the new usableBatteryCapacity
  fetchRoute(computedBatteryCapacity, routeData => {
    if (routeData) {
      drawRoutePolyline(routeData);
    } else {
      errorToast.style.transform = `translateY(0)`;

      setTimeout(() => {
        errorToast.style.transform = `translateY(100%)`;
      }, 3500);
    }

    rangeSlider.disabled = false;
    loadingToast.style.transform = `translateY(100%)`;
  });
});

export const getBatteryCapacity = () =>
  usableBatteryCapacityInKWH + (usableBatteryCapacityInKWH / 100) * rangeSlider.value;

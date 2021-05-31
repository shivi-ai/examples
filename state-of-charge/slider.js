import { fetchRoute } from './client';
import { drawRoutePolyline } from './index';

const rangeSlider = document.getElementById('range');
const loadingToast = document.getElementById('loading-toast');
const errorToast = document.getElementById('error-toast');

/**
 * Attach an event listener to our slider to update the current vehicle range
 */
rangeSlider.addEventListener('input', () => {
  const vehicleRange = document.getElementById('vehicle-range');
  vehicleRange.innerHTML = `${rangeSlider.value} km`;
});

/**
 * Attach an event listener that updates our route with the new slider value on release
 */
rangeSlider.addEventListener('change', () => {
  rangeSlider.disabled = true;
  loadingToast.style.transform = `translateY(0)`;

  fetchRoute(rangeSlider.value, routeData => {
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

export const getStateOfCharge = () => rangeSlider.value;

import { fetchRoute } from './client';
import { drawRoutePolyline } from './index';

const rangeSlider = document.getElementById('range');

rangeSlider.addEventListener('input', () => {
  const percent = (rangeSlider.value - rangeSlider.min) / (rangeSlider.max - rangeSlider.min);
  const thumbPosition = percent * rangeSlider.offsetWidth - 70 * percent;

  const rangeThumb = document.getElementById('range-thumb');
  rangeThumb.innerHTML = `${rangeSlider.value} km`;
  rangeThumb.style.left = `calc((${thumbPosition}px))`;
});

rangeSlider.addEventListener('change', () => {
  document.getElementById('reroutingNotification').style.display = 'flex';

  fetchRoute(rangeSlider.value, routeData => {
    drawRoutePolyline(routeData);
    document.getElementById('reroutingNotification').style.display = 'none';
  });
});

export const getStateOfCharge = () => rangeSlider.value;

import { getStations } from './client';
import { showCenter, showStations } from './map';

/**
 * In this example the range, power and amenities are dynamic.
 * A charging station can be slow (< 43 kW), fast (< 100 kW) or turbo.
 * When any of these values are changed we update the map.
 */
const powers = {
  slow: [3, 3.5, 3.6, 3.7, 4, 6, 7, 7.4, 8, 10, 11, 13, 14, 16, 18, 20, 22, 36, 40],
  fast: [43, 45, 50, 60, 80],
  turbo: [100, 120, 125, 129, 135, 150, 175, 200, 250, 350, 400],
};

export const attachEventListeners = () => {
  const filters = [...document.querySelectorAll('.checklist input')];

  filters.forEach(input => input.addEventListener('change', didChangeFilter));
  document.getElementById('range').addEventListener('input', didReleaseRangeSlider);
};

const didReleaseRangeSlider = event => {
  document.getElementById('distance').innerHTML = `${event.target.value / 1000} km`;
  const filters = getFilters();
  updateStationsOnMap(filters);
};

const didChangeFilter = () => {
  const filters = getFilters();
  updateStationsOnMap(filters);
};

const getFilters = () => {
  const rangeSlider = document.getElementById('range');
  const selectedAmenityInputs = [...document.querySelectorAll('.amenities input[type=checkbox]:checked')];
  const selectedPowerInputs = [...document.querySelectorAll('.power input[type=checkbox]:checked')];

  const selectedAmenities = selectedAmenityInputs.map(input => input.value);
  const selectedPowers = selectedPowerInputs
    .map(input => input.value)
    .reduce((acc, power) => acc.concat(powers[power]), []);

  return {
    distance: parseInt(rangeSlider.value),
    power: selectedPowers,
    amenities: selectedAmenities,
  };
};

const updateStationsOnMap = filters => {
  getStations(filters)
    .then(stations => {
      showCenter();
      showStations(stations);
    })
    .catch(error => console.log(error));
};

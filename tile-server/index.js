import { displayMap } from './map';

/**
 * For this example we give two providers with different data-sets.
 * EcoMovement and Open Charge Map. You can switch between the two.
 */
const searchParams = new URLSearchParams(document.location.search);
const provider = searchParams.get('provider');
displayMap(provider);

document.querySelector('.legend-button').addEventListener('click', () => {
  const legend = document.getElementById('legend');
  if (legend.style.display !== 'block') {
    legend.style.display = 'block';
  } else {
    legend.style.display = 'none';
  }
});

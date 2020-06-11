import { displayMap } from './map';

/**
 * For this example we give two providers with different data-sets
 * EcoMovement and Open Charge Map. Users can switch between the two.
 */

let searchParams = new URLSearchParams(document.location.search);
const urlEnd = searchParams.get('provider');

if (urlEnd === 'ocm') {
  document.getElementById('ocm').setAttribute('class', 'clicked');
  displayMap({ provider: urlEnd });
} else {
  document.getElementById('eco').setAttribute('class', 'clicked');
  displayMap({ provider: urlEnd });
}

document.getElementById('eco').addEventListener('click', () => {
  searchParams.set('provider', 'eco');
  window.location.href = '?' + searchParams.toString();
});

document.getElementById('ocm').addEventListener('click', () => {
  searchParams.set('provider', 'ocm');
  window.location.href = '?' + searchParams.toString();
});

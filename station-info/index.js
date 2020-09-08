import { fetchStations } from './client';
import { showStations } from './map.js';

/**
 * In this example we fetch 20 station around the Hamburg center, Germany.
 * Click on the station to fetch its details.
 */
fetchStations()
  .then(stations => {
    showStations(stations);
  })
  .catch(error => console.log(error));

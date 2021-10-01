import { showStations, showCenter } from './map.js';
import { attachEventListeners } from './interface.js';
import { getStations } from './client.js';

getStations({})
  .then(stations => {
    showCenter();
    showStations(stations);
  })
  .catch(error => console.log(error));

attachEventListeners();

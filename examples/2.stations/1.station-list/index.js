import { showStations, showCenter } from './map.js';
import { attachEventListeners } from './interface.js';
import { getStations } from './client.js';

/**
 * This project shows you how to fetch a vehicle list and render the vehicle details
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 */

getStations({})
  .then(stations => {
    showCenter();
    showStations(stations);
  })
  .catch(error => console.log(error));

attachEventListeners();

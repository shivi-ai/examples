import { drawMap } from './map.js';
import { getVehicleList } from './client.js';

/**
 * This project shows you how to fetch a vehicle list and render the vehicle details
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 */

drawMap();
getVehicleList({ page: 0 });

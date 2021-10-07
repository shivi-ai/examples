import { getRoute } from './client';
import { attachEventListeners, renderRouteData } from './interface';
import { drawRoutePolyline } from './map';

/**
 * This project shows you how to fetch a car list and render the car details
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 */

getRoute(route => {
  drawRoutePolyline(route);
  renderRouteData(route);
  attachEventListeners(route);
});

import { getRoute } from './client.js';
import { decodePolylines } from './map.js';
import { attachEventListeners, renderRouteDetails, renderRouteHeader, renderTabData } from './interface.js';

/**
 * This project shows you how to render alternative routes.
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 */

getRoute((route, alternatives) => {
  decodePolylines(route, alternatives);

  renderTabData(route, alternatives);
  renderRouteHeader(route);
  renderRouteDetails(route);

  attachEventListeners();
});

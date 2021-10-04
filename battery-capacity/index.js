import { getRoute } from './client';
import { attachEventListeners, getBatteryCapacity, renderRouteHeader, renderErrorToast } from './interface';
import { drawRoutePolyline } from './map';

/**
 * This project shows you how to render alternative routes.
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 */

getRoute(getBatteryCapacity(), routeData => {
  if (routeData) {
    drawRoutePolyline(routeData);
    renderRouteHeader(routeData);
  } else {
    renderErrorToast();
  }
});

attachEventListeners();

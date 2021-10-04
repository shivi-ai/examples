import { getRoute } from './client';
import { renderRouteHeader, renderRouteDetails, renderGraph, attachEventListeners } from './interface';
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

getRoute((routeId, routeData) => {
  drawRoutePolyline(routeId, routeData);

  renderRouteHeader(routeData);
  renderRouteDetails(routeData.pathPlot[0]);
  renderGraph(routeData);
});

attachEventListeners();

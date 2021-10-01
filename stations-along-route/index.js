import { getRoute } from './client.js';
import { attachEventListeners, renderRouteHeader } from './interface.js';
import { drawRoutePolyline } from './map.js';

getRoute(routeData => {
  drawRoutePolyline(routeData);
  renderRouteHeader(routeData);
  attachEventListeners(routeData);
});

import { createRoute, fetchOperatorList } from './client';
import { attachEventListeners, parseRouteResponse, renderOperators } from './interface';

/**
 * This project shows you how to fetch a car list and render the car details
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 */

const loadingToast = document.getElementById('loading-toast');
const recalculateButton = document.getElementById('recalculate');

loadingToast.style.transform = `translateY(0)`;
recalculateButton.disabled = true;

createRoute({}, route => {
  parseRouteResponse(route);
});

fetchOperatorList({ page: 0 }, renderOperators);
attachEventListeners();

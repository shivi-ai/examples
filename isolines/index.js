import { drawIsoline } from './map';
import { getIsoline } from './client';
import { renderErrorToast } from './interface';

/**
 * This project shows you how to fetch an isoline and render it on a map
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering
 *    - queries.js - The GraphQL queries used in the networking requests
 */

getIsoline(isoData => {
  if (isoData) {
    drawIsoline(isoData);
  } else {
    renderErrorToast();
  }
});

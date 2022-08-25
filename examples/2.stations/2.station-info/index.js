import { getStations, getStationData } from './client';
import { showStations } from './map.js';
import { attachEventListeners, renderGraph, renderStationData } from './interface';

/**
 * This project shows you how to fetch a car list and render the car details
 * The project structure contains;
 *
 *    - client.js - All networking requests
 *    - interface.js - All interface rendering
 *    - map.js - All map rendering (including routes and waypoints)
 *    - queries.js - The GraphQL queries used in the networking requests
 *    - utils.js - Some helpers to format station data for rendering
 */

getStations()
  .then(stations => {
    showStations(stations);
    getStationData(stations[0].id).then(data => {
      renderStationData(data);
      renderGraph(data.station.predicted_occupancy, 0);
      attachEventListeners(data.station.predicted_occupancy);
    });
  })
  .catch(error => console.log(error));

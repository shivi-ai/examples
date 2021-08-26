import { fetchStations, fetchStationData } from './client';
import { displayStationData } from './station';
import { addOccupancyListeners, renderGraph } from './occupancy';
import { showStations } from './map.js';

/**
 * This function kicks off the example and renders 20 stations
 * within a radius of 3km of the city center of Hamburg, Germany.
 *
 * It will also render the details of the first station on the card on the left.
 */
fetchStations()
  .then(stations => {
    showStations(stations);
    fetchStationData(stations[0].id).then(data => {
      displayStationData(data);
      addOccupancyListeners(data.station.predicted_occupancy);
      renderGraph(data.station.predicted_occupancy, 0);
    });
  })
  .catch(error => console.log(error));

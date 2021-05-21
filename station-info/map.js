import mapboxgl from 'mapbox-gl';
import { fetchStationData } from './client';
import { displayStationData } from './station';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 14,
  center: [9.9801115, 53.5475679],
});

/**
 * Attach a click handler to the map features so we can fetch details of the clicked station.
 */
map.on('click', 'stations', function(e) {
  const stationId = e.features[0]?.properties?.stationId;
  if (stationId) {
    fetchStationData(stationId).then(data => data && displayStationData(data));
  }

  const navigateButton = document.getElementById('navigate');
  navigateButton.disabled = true;

  map.flyTo({
    center: e.features[0].geometry.coordinates,
    offset: [80, 0],
  });
});

/**
 * Icon for the charging station differs base on the speed (slow, fast, turbo),
 * and status(available, busy, unkown or broken).
 *
 * If a charging station has multiple speeds the fastest speed will be shown.
 * @param { object } station - Station data
 */
const selectPinlet = station => `${station.status}-${station.speed}`;

/**
 * Draw the stations on the map.
 *
 * @param { Array } stations - Array of stations
 */
export const showStations = stations => {
  if (!stations) return;

  if (map.getLayer('path')) map.removeLayer('path');
  if (map.getSource('path')) map.removeSource('path');

  const points = stations.map(station => ({
    type: 'Feature',
    properties: {
      icon: selectPinlet(station),
      stationId: station.id,
    },
    geometry: station.location,
  }));

  map.addLayer({
    id: 'stations',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.9,
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
    },
  });
};

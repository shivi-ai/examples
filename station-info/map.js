import mapboxgl from 'mapbox-gl';
import { fetchStationData } from './client';
import { displayStationData, showLoader } from './station';

// eslint-disable-next-line no-undef
mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 14,
  center: [9.9801115, 53.5475679],
});

map.on('click', 'stations', function(e) {
  const stationId = e.features[0]?.properties?.stationId;
  if (stationId) {
    showLoader();
    fetchStationData(stationId).then(data => data && displayStationData(data));
  }

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
 * @param station {object} Station data
 */
const selectPinlet = station => `${station.status}-${station.speed}`;

/**
 * Draw the stations on the map.
 *
 * @param stations {array} Array of stations
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

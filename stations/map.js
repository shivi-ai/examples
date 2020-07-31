import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 11.4,
  center: [4.8979755, 52.3745403],
});

/**
 * Icon for the charging station differs base on the speed (slow, fast, turbo),
 * and status(available, busy, unkown or broken).
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
  if (!stations || stations.length === 0) return;

  document.getElementById('stationAmount').innerHTML = stations.length;
  if (map.getLayer('path')) map.removeLayer('path');
  if (map.getSource('path')) map.removeSource('path');

  const points = stations.map(station => ({
    type: 'Feature',
    properties: {
      icon: selectPinlet(station),
    },
    geometry: station.location,
  }));

  map.addLayer({
    id: 'path',
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

export const showCenter = () => {
  if (map.getSource('start')) return;
  map.addSource('start', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [4.8979755, 52.3745403],
          },
        },
      ],
    },
  });

  map.addLayer({
    id: 'start',
    type: 'symbol',
    source: 'start',
    layout: {
      'icon-allow-overlap': true,
      'icon-image': 'location_big',
      'icon-size': 1,
    },
  });
};

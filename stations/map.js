import mapboxgl from 'mapbox-gl';

// eslint-disable-next-line no-undef
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 11.4,
  center: [10.197422, 56.171395],
});

map.on('load', function() {
  // add empty user location source
  if (!map.getSource('user-location-source')) {
    map.addSource('user-location-source', {
      type: 'geojson',
      cluster: false,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
  }

  // add user location layer
  if (!map.getLayer('user-location')) {
    map.addLayer({
      id: 'user-location',
      type: 'symbol',
      source: 'user-location-source',
      interactive: false,
      layout: {
        'text-ignore-placement': true,
        'icon-image': 'your-location',
        'icon-allow-overlap': false,
      },
    });
  }
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
  if (!stations) return;

  document.getElementById('stationAmount').innerHTML =
    stations.length > 1 ? `${stations.length} stations` : `${stations.length} station`;
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
            coordinates: [10.197422, 56.171395],
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

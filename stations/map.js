import mapboxgl from 'mapbox-gl';

// eslint-disable-next-line no-undef
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 11.4,
  center: [4.8979755, 52.3745403],
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

  document.getElementById('centerMe').style.visibility = 'visible';
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

/* Center map on my location */
const userLocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(resolve, reject, userLocationOptions);
    } else {
      reject();
    }
  });
};

export const centerMe = async () => {
  try {
    const {
      coords: { latitude, longitude },
    } = await getLocation();

    if (latitude && longitude) {
      if (map.getLayer('user-location') && map.getSource('user-location-source')) {
        map.getSource('user-location-source').setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            },
          ],
        });
      }

      map.flyTo({
        center: [longitude, latitude],
      });
    }
  } catch (error) {
    document.getElementById('centerMe').innerHTML = '🚫';
    console.log(error);
  }
};

import mapboxgl from 'mapbox-gl';

/**
 * Mapbox runs 'transformRequest' before it makes a request for an external URL
 * We use this callback to set a client key in the header of the request to Chargetrip API.
 * See example in MapboxGL JS documentation: https://docs.mapbox.com/mapbox-gl-js/api/#requestparameters.
 *
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 3,
  center: [4.8979755, 52.367],
  transformRequest: (url, resourceType) => {
    if (resourceType === 'Tile' && url.startsWith('https://api.chargetrip.io')) {
      return {
        url: url,
        headers: {
          'x-client-id': '5ed1175bad06853b3aa1e492',
        },
      };
    }
  },
});

/**
 * Display all stations that we request from the Tile Server.
 *
 * For this example we request stations with either a CHADEMO or IEC_62196_T2_COMBO connector.
 * The stations will be clustered.
 * When clicking on a cluster you will zoom in and the map will be centered around that point.
 */
map.on('load', () => {
  map.addSource('stations', {
    type: 'vector',
    tiles: [
      'https://api.chargetrip.io/station/{z}/{x}/{y}/tile.mvt?&connectors[]=CHADEMO&connectors[]=IEC_62196_T2_COMBO',
    ],
  });

  /**
   * This tfirst layer will display a station icon.
   * This layer will only be shown if the cluster count is 1
   */
  map.addLayer({
    id: 'unclustered-stations',
    type: 'symbol',
    layout: {
      'icon-image': 'free-fast-pinlet',
      'icon-size': 0.55,
    },
    source: 'stations',
    'source-layer': 'stations',
  });

  /**
   * This second layer will display the clusterd stations.
   * This layer will be shown as long as the cluster count is above 1.
   */
  map.addLayer({
    id: 'clusters',
    type: 'symbol',
    source: 'stations',
    'source-layer': 'stations',
    interactive: true,
    filter: ['>', ['get', 'count'], 1],
    layout: {
      'icon-image': 'empty-charger',
      'icon-size': 0.8,
      'text-field': '{count}',
      'text-size': 8,
    },
  });
});

/**
 * When clicking on a cluster we will receive its zoom level and coordinates.
 * If our zoom level is less then 9 we will change the zoom level to 9.
 * If the zoom level is between 9 and 13 the zoom level will be changed to 13.
 * The map will always be re-centered around the cluster that was clicked on.
 */
map.on('click', ({ point, target }) => {
  const features = target.queryRenderedFeatures(point, {
    layers: ['clusters', 'unclustered-stations'],
  });
  if (features && features.length > 0 && features[0].properties.count > 1) {
    map.flyTo({
      center: [features[0].properties.lng, features[0].properties.lat],
      zoom: features[0].properties.expansionZoom,
      speed: 1,
    });
  } else if (features && features.length > 0) {
    map.flyTo({
      center: [features[0].properties.lng, features[0].properties.lat],
    });
  }
});

map.on('load', function() {
  map.addSource('eco', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8, 61],
            [11, 61],
            [11, 45],
            [8, 45],
            [8, 61],
          ],
        ],
      },
    },
  });
  map.addLayer({
    id: 'eco',
    type: 'line',
    source: 'eco',
    layout: {},
    paint: {
      'line-color': '#010738',
    },
  });
});

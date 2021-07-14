import mapboxgl from 'mapbox-gl';

/**
 * Mapbox runs 'transformRequest' before it makes a request for an external URL
 * We use this callback to set a client key in the header of the request to Chargetrip API.
 * See example in MapboxGL JS documentation: https://docs.mapbox.com/mapbox-gl-js/api/#requestparameters.
 *
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key sin this example is are public ones and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 *
 */
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

export const displayMap = () => {
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
    zoom: 3.5,
    center: [4.8979755, 52.367],
    transformRequest: (url, resourceType) => {
      if (resourceType === 'Tile' && url.startsWith('https://api.chargetrip.io')) {
        const headers = {
          //Replace this x-client-id with your own to get access to more station data
          'x-client-id': '5ed1175bad06853b3aa1e492',
          'Cache-Control': 'max-age=0',
        };

        return {
          url,
          headers,
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
        'https://api.chargetrip.io/station/{z}/{x}/{y}/tile.mvt?&powers=all&connectors[]=CHADEMO&connectors[]=IEC_62196_T2_COMBO',
      ],
    });
    /**
     * The first layer will display a station icon.
     * This layer will only be shown if the cluster count is 1
     */
    map.addLayer({
      id: 'unclustered-stations',
      type: 'symbol',
      layout: {
        'icon-image': ['concat', ['get', 'status'], '-', ['get', 'speed']],
        'icon-size': 0.9,
        'icon-offset': [0, -16],
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
        'icon-image': 'cluster',
        'icon-size': 0.9,
        'icon-offset': [0, -16],
        'text-field': [
          'case',
          ['<', ['get', 'count'], 1000],
          ['get', 'count'],
          ['>=', ['get', 'count'], 1000],
          ['concat', ['to-string', ['round', ['/', ['get', 'count'], 1000]]], 'K'],
          '-',
        ],
        'text-size': 10,
        'text-offset': [0, -1.5],
      },
      paint: {
        'text-color': '#ffffff',
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
    if (features && features.length > 0 && features[0].properties?.count > 1) {
      map.flyTo({
        center: [features[0].properties?.lng, features[0].properties?.lat],
        zoom: features[0].properties?.expansionZoom,
        speed: 1,
      });
    } else if (features && features.length > 0) {
      map.flyTo({
        center: [features[0].properties?.lng, features[0].properties?.lat],
      });
    }
  });

  /**
   * Our ecomovement data is limited on our free key.
   * We draw a polygon using this function to show what area of data is available for free.
   */
  map.on('load', () => {
    map.addSource('eco', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-180, -90],
              [180, -90],
              [180, 90],
              [-180, 90],
              [-180, -90],
            ],
            [
              [7.8, 61],
              [11.3, 61],
              [11.3, 45],
              [7.8, 45],
              [7.8, 61],
            ],
          ],
        },
      },
    });
    map.addLayer({
      id: 'eco',
      type: 'fill',
      source: 'eco',
      layout: {},
      paint: {
        'fill-color': '#282A30',
        'fill-opacity': 0.6,
      },
    });
  });
};

import mapboxgl from 'mapbox-gl';
import { getDurationString } from '../utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 5.5,
  center: [8.7320104, 52.3758916],
});

/**
 * Draw route polyline and show charging stations on the map.
 *
 * @param coordinates {array} Array of coordinates
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
const drawRoute = (coordinates, legs) => {
  if (map.loaded()) {
    drawPolyline(coordinates);
    showLegs(legs);
  } else {
    map.on('load', () => {
      drawPolyline(coordinates);
      showLegs(legs);
    });
  }
};

/**
 * Draw route polyline on a map.
 *
 * @param coordinates {object} polyline coordinates
 */
const drawPolyline = coordinates => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          properties: {},
          coordinates,
        },
      },
    ],
  };

  map.addSource('polyline-source', {
    type: 'geojson',
    data: geojson,
  });

  map.addLayer({
    id: 'polyline',
    type: 'line',
    options: 'beforeLayer',
    source: 'polyline-source',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#00A9E0',
      'line-width': 3,
    },
  });
};

/**
 * Show the charging station, origin and destination on the map.
 *
 * Last leg of the route is a destination point.
 * All other legs are either charging stations or via points (if route has stops).
 *
 * @param legs {array} route legs
 */
function showLegs(legs) {
  if (legs.length === 0) return;

  let points = [];

  // we want to show origin point on the map
  // to do that we use origin of the first leg
  points.push({
    type: 'Feature',
    properties: {
      icon: 'location_big',
    },
    geometry: legs[0].origin.geometry,
  });

  legs.map((leg, index) => {
    // add charging stations
    if (index !== legs.length - 1) {
      points.push({
        type: 'Feature',
        properties: {
          icon: 'pinlet',
          description: index + 1,
        },
        geometry: leg.destination.geometry,
      });
    } else {
      // add destination point (last leg)
      points.push({
        type: 'Feature',
        properties: {
          icon: 'destination',
        },
        geometry: leg.destination.geometry,
      });
    }
  });

  // draw route points on a map
  map.addLayer({
    id: 'legs',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.55,
      'icon-offset': [
        'case',
        ['==', ['get', 'icon'], 'pinlet'],
        ['literal', [50, -20]],
        ['==', ['get', 'icon'], 'destination'],
        ['literal', [0, -20]],
        ['literal', [0, 0]],
      ],
      'text-field': ['get', 'description'],
      'text-allow-overlap': true,
      'text-offset': [-0.35, -1.6],
      'text-size': 9,
    },
    paint: {
      'text-color': '#FFFFFF',
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
    },
  });

  loadMarkers(legs);
}

/**
 * Draw single marker on a map.
 *
 * @param coordinates {array} point coordinates
 * @param label {string} point label
 * @param offset {array} marker offset
 * @param className {string} marker classname
 */
const addMarker = (coordinates, label, offset, className = 'location-label') => {
  const marker = document.createElement('div');
  marker.innerHTML = label;
  marker.className = className;
  new mapboxgl.Marker(marker, { offset }).setLngLat(coordinates).addTo(map);
};

/**
 * Add markers to the map describing each point of the route.
 *
 * @param legs {array} route points
 */
function loadMarkers(legs) {
  // origin point marker (origin of the first leg)
  const label = `From<br><strong>Amsterdam</strong>`;
  const offset = [+30, -30];
  addMarker(legs[0].origin.geometry.coordinates, label, offset);

  legs.map((leg, index) => {
    // charging stations
    if (index !== legs.length - 1) {
      const label = `<strong>${getDurationString(leg.chargeTime)}</strong> charge`;
      const offset = [+35, -15];
      addMarker(leg.destination.geometry.coordinates, label, offset, 'rounded-label');
    } else {
      // destination point marker (the last leg)
      const label = `To<br><strong>Berlin</strong>`;
      const offset = [-20, -45];
      addMarker(leg.destination.geometry.coordinates, label, offset);
    }
  });
}

export { drawRoute };

import mapboxgl from 'mapbox-gl';
import * as mapboxPolyline from '@mapbox/polyline';
import { getDurationString } from '../utils';
import { searchOperatorList } from './client';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

let popups = [];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 6,
  center: [9.1320104, 54.9758916],
});

/**
 * Draw a route on a map.
 *
 * Route object contains `polyline` data -  the polyline encoded route (series of coordinates as a single string).
 * We need to decode this information first. We use Mapbox polyline tool (https://www.npmjs.com/package/@mapbox/polyline) for this.
 * As a result of decoding we get pairs [latitude, longitude].
 * To draw a route on a map we use Mapbox GL JS. This tool uses the format [longitude,latitude],
 * so we have to reverse every pair.
 *
 * @param data {object} route specification
 */
export const drawRoutePolyline = data => {
  const decodedData = mapboxPolyline.decode(data.polyline);
  const reversed = decodedData.map(item => item.reverse());

  drawRoute(reversed, data.legs);
};

/**
 * Draw route polyline and show charging stations on the map.
 *
 * @param coordinates {array} Array of coordinates
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
export const drawRoute = (coordinates, legs) => {
  if (map.loaded()) {
    drawPolyline(coordinates);
    drawOperatorName(legs);
    showLegs(legs);
  } else {
    map.on('load', () => {
      drawPolyline(coordinates);
      drawOperatorName(legs);
      showLegs(legs);
    });
  }
};

/**
 * Render the charging times at each station directly on top of it's marker.
 * @param {array} legs - each leg represents either a charging station, or a via point or final point
 */
const drawOperatorName = legs => {
  popups.forEach(popup => {
    popup.remove();
  });

  legs.forEach((leg, idx) => {
    if (idx == legs.length - 1) {
      return;
    }

    searchOperatorList({ page: 0, size: 10, search: leg.operatorId, searchById: true }, data => {
      console.log(data);
      const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(leg.destination.geometry.coordinates)
        .setHTML(`<small>${data.length ? data[0].name : 'Unknown'}</small>`)
        .addTo(map);

      popups.push(popup);
    });
  });
};

/**
 * Draw route polyline on a map.
 *
 * @param coordinates {array} polyline coordinates
 */
const drawPolyline = coordinates => {
  if (map.getLayer('polyline')) map.removeLayer('polyline');
  if (map.getSource('polyline-source')) map.removeSource('polyline-source');

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
    lineMetrics: true,
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
      'line-color': '#0078FF',
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
const showLegs = legs => {
  if (map.getLayer('legs')) map.removeLayer('legs');
  if (map.getSource('legs')) map.removeSource('legs');
  if (legs.length === 0) return;

  let points = [];

  // we want to show origin point on the map
  // to do that we use the origin of the first leg
  points.push({
    type: 'Feature',
    properties: {
      icon: 'location_big',
    },
    geometry: legs[0].origin?.geometry,
  });

  legs.map((leg, index) => {
    // add charging stations
    if (index !== legs.length - 1) {
      points.push({
        type: 'Feature',
        properties: {
          description: `${getDurationString(leg.chargeTime)}`,
          icon: 'unknown-turbo',
        },
        geometry: leg.destination?.geometry,
      });
    } else {
      // add destination point (last leg)
      points.push({
        type: 'Feature',
        properties: {
          icon: 'arrival',
        },
        geometry: leg.destination?.geometry,
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
      'icon-offset': ['case', ['==', ['get', 'icon'], 'location_big'], ['literal', [0, 0]], ['literal', [0, -15]]],
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

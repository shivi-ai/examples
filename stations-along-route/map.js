import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

export const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 7.5,
  center: [6, 52.2288],
});

/**
 * Draw route polyline and show charging stations on the map.
 *
 * @param coordinates {array} Array of coordinates
 * @param legs {array} route legs (stops) - each leg represents either a charging station, or via point or final point
 */
export const drawRoute = (coordinates, legs) => {
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
 * @param coordinates {array} polyline coordinates
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
      'line-color': '#0078FF',
      'line-width': 3,
    },
  });
};

/**
 * Show the charging station, origin and destination on the map.
 *
 * The origin of the first leg is the start of your route.
 * The destination of the last is the destination of your route.
 * The desitinatation of all other legs are charging stations or via points.
 *
 * @param legs {array} route legs
 */
const showLegs = legs => {
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

  for (let i = 0; i < legs.length; i++) {
    // add charging stations
    if (i !== legs.length - 1) {
      points.push({
        type: 'Feature',
        properties: {
          icon: 'free-turbo',
        },
        geometry: legs[i].destination?.geometry,
      });
    } else {
      // add destination point (last leg)
      points.push({
        type: 'Feature',
        properties: {
          icon: 'arrival',
        },
        geometry: legs[i].destination?.geometry,
      });
    }
  }

  // draw route points on a map
  map.addLayer({
    id: 'legs',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 1,
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

/**
 * Icon for the charging station differs base on the speed (slow, fast, turbo),
 * and status(available, busy, unkown or broken).
 * If a charging station has multiple speeds the fastest speed will be shown.
 * @param station {object} Station data
 */
const selectPinlet = station => `along-${station.speed}`;

export const showAlternatives = alternatives => {
  if (alternatives.length === 0) return;

  const locations = alternatives.map(station => {
    return {
      type: 'Feature',
      properties: {
        icon: selectPinlet(station),
      },
      geometry: station.location,
    };
  });

  // draw route points on a map
  map.addLayer({
    id: 'stations-along-route',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: locations,
      },
    },
  });
};

export const hideAlternatives = () => {
  if (map.getLayer('stations-along-route') && map.getSource('stations-along-route')) {
    map.removeLayer('stations-along-route');
    map.removeSource('stations-along-route');
  }
};

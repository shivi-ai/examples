import mapboxgl from 'mapbox-gl';
import * as mapboxPolyline from '@mapbox/polyline';
import { getDurationString } from '../../../utils';

/**
 * More information on how a route can be drawn can be found in our route example.
 * Route example: https://examples.chargetrip.com/route
 */

let popups = [];

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

const map = new mapboxgl.Map({
  cooperativeGestures: true,
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 6,
  center: [9.1320104, 54.9758916],
});

export const drawRoutePolyline = data => {
  const decodedData = mapboxPolyline.decode(data.polyline);
  const reversed = decodedData.map(item => item.reverse());

  drawRoute(reversed, data.legs, data.duration);
};

export const drawRoute = (coordinates, legs, duration) => {
  if (map.loaded()) {
    drawPolyline(coordinates);
    drawPopUps(legs, duration);
    showLegs(legs);
  } else {
    map.on('load', () => {
      drawPolyline(coordinates);
      drawPopUps(legs, duration);
      showLegs(legs);
    });
  }
};

const drawPopUps = (legs, duration) => {
  popups.forEach(popup => {
    popup.remove();
  });

  legs.forEach((leg, index) => {
    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(leg.destination.geometry.coordinates)
      .setHTML(`<small>${index == legs.length - 1 ? getDurationString(duration) : leg.name}</small>`)
      .addTo(map);

    popups.push(popup);
  });
};

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

const showLegs = legs => {
  if (map.getLayer('legs')) map.removeLayer('legs');
  if (map.getSource('legs')) map.removeSource('legs');
  if (legs.length === 0) return;

  let points = [];

  points.push({
    type: 'Feature',
    properties: {
      icon: 'location_big',
    },
    geometry: legs[0].origin?.geometry,
  });

  legs.map((leg, index) => {
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
      points.push({
        type: 'Feature',
        properties: {
          icon: 'arrival',
        },
        geometry: leg.destination?.geometry,
      });
    }
  });

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

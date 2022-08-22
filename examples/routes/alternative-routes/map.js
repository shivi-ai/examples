import mapboxgl from 'mapbox-gl';
import * as mapboxPolyline from '@mapbox/polyline';
import { renderRouteDetails, renderRouteHeader, tabHandler } from './interface';
import { getDurationString } from '../../../utils';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

export let routes;

const map = new mapboxgl.Map({
  cooperativeGestures: true,
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 6.8,
  center: [8.8320104, 47.9758916],
});

// Display the charge time on a hover
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
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
 * @param { object } route - The fastest route
 * @param { array } alternatives - The alternative route objects
 */
export const decodePolylines = (route, alternatives) => {
  const _routes = [];

  const decodedData = mapboxPolyline.decode(route.polyline);
  const reversed = decodedData.map(item => item.reverse());

  _routes.push({ data: route, polyline: reversed });

  alternatives.map(item => {
    const decoded = mapboxPolyline.decode(item.polyline);
    const itemReversed = decoded.map(item => item.reverse());
    _routes.push({ data: item, polyline: itemReversed });
  });

  routes = _routes;

  drawRoutes(routes);
};

/**
 * Draw route polyline and show charging stations on the map.
 * @param { array } routes - The route and alternative routes between two points
 */
const drawRoutes = routes => {
  if (map.loaded()) {
    routes.forEach((route, index) => drawPolyline(route, index, index === 0 ? '#0078FF' : '#9CA7B2'));
    map.moveLayer(`0`);
    showLegs(routes[0].data.legs);
  } else {
    map.on('load', () => {
      routes.forEach((route, index) => drawPolyline(route, index, index === 0 ? '#0078FF' : '#9CA7B2'));
      map.moveLayer(`0`);
      showLegs(routes[0].data.legs);
    });
  }

  for (let i = 0; i < routes.length; i++) {
    map.on('mouseenter', `${i}`, e => {
      map.getCanvas().style.cursor = 'pointer';
      const coordinates = e.lngLat;
      const description =
        `<strong>${getDurationString(routes[i].data.duration ?? 0)}` +
        ` • ` +
        `${routes[i].data.charges ?? 0} stops</strong>`;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on('click', `${i}`, () => {
      const routeOptions = document.querySelectorAll('.tab');
      const tabHighlighter = document.getElementById('tab-highlighter');

      tabHandler(i, routeOptions, tabHighlighter);
      highlightRoute(i, routes);
    });

    map.on('mouseleave', `${i}`, () => {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  }
};

/**
 * Draw the polyline on the map
 * @param { object } route - All the route data to draw the route
 * @param { number } index - The current index of the route we are going to draw
 * @param { string } linecolor - The line color in a hex string
 */
const drawPolyline = (route, index, linecolor) => {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          properties: {
            description: route.data.duration + ' ' + route.data.charges,
          },
          coordinates: route.polyline,
        },
      },
    ],
  };

  map.addSource(`${index}`, {
    type: 'geojson',
    lineMetrics: true,
    data: geojson,
  });

  map.addLayer({
    id: `${index}`,
    type: 'line',
    options: 'beforeLayer',
    source: `${index}`,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': linecolor,
      'line-width': 5,
    },
  });
};

/**
 * Helper function that draws the legs of a route. Allows us to show charging stations, origin and destination
 * Last leg of the route is always a destination point
 * All other legs are either charging stations or via points (if route has additional stops)
 *
 * @param { array } legs - The legs of the route
 */
const showLegs = legs => {
  if (legs.length === 0) return;
  if (map.getLayer('legs')) map.removeLayer('legs');
  if (map.getSource('legs')) map.removeSource('legs');

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
      'icon-ignore-placement': true,
      'icon-size': ['case', ['==', ['get', 'icon'], 'location-big'], ['literal', 0.7], ['literal', 0.8]],
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
 * Highlight the route that was clicked.
 *
 * @param { object } routes - All routes recieved from the route query
 * @param { number } id - index / id of the polyline that was clicked on
 */
export const highlightRoute = (id, routes) => {
  map.setPaintProperty(`${id}`, 'line-color', '#0078FF');
  for (let j = 0; j < routes.length; j++) {
    if (j !== id) {
      map.setPaintProperty(`${j}`, 'line-color', '#9CA7B2');
    }
  }
  map.moveLayer(`${id}`);
  showLegs(routes[id].data.legs);
  renderRouteDetails(routes[id].data);
  renderRouteHeader(routes[id].data);
};

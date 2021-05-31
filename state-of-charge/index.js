import { drawRoute } from './map.js';
import * as mapboxPolyline from '@mapbox/polyline';
import { fetchRoute } from './client';
import { getStateOfCharge } from './slider';
import { getDurationString } from '../utils';

/**
 * Draw a route on a map.
 *
 * The route object contains `polyline` data -  the polyline encoded route (series of coordinates as a single string).
 * We need to decode this information first. We use Mapbox polyline tool (https://www.npmjs.com/package/@mapbox/polyline) for this.
 * As a result of decoding we get pairs [latitude, longitude].
 * To draw a route on a map we use Mapbox GL JS. This tool uses the format [longitude,latitude],
 * so we have to reverse every pair.
 *
 * @param { object } data - route specification.
 * @param { string } id - route ID.
 */
fetchRoute(getStateOfCharge(), routeData => {
  const errorToast = document.getElementById('error-toast');
  const vehicleRange = document.getElementById('vehicle-range');
  const rangeSlider = document.getElementById('range');

  vehicleRange.innerHTML = `${rangeSlider.value} km`;

  if (routeData) {
    drawRoutePolyline(routeData);
  } else {
    errorToast.style.transform = `translateY(0)`;

    setTimeout(() => {
      errorToast.style.transform = `translateY(100%)`;
    }, 2500);
  }
});

export const drawRoutePolyline = data => {
  const decodedData = mapboxPolyline.decode(data.polyline);
  const reversed = decodedData.map(item => item.reverse());

  drawRoute(reversed, data.legs);
  renderRouteHeader(data);
};

/**
 * Function that renders the header details
 * @param { object } data - All available route data
 */
const renderRouteHeader = data => {
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';
  const routeStops = `${data.charges ?? 0} stops`;
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;
};

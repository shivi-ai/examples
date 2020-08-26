import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { pipe, subscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createRoute, routeUpdate } from './queries.js';
import { drawRoute, showAlternatives, hideAlternatives } from './map.js';
import * as mapboxPolyline from '@mapbox/polyline';
import { getDurationString } from '../utils';

/**
 * Example application of how to build a route with the Chargetrip API.
 * This route will show alternative stations along the route.
 * Please have a look to Readme file in this repo for more details.
 *
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  'x-client-id': '5e8c22366f9c5f23ab0eff39',
};

const subscriptionClient = new SubscriptionClient('wss://api.chargetrip.io/graphql', {
  reconnect: true,
  connectionParams: headers,
});

const client = createClient({
  url: 'https://api.chargetrip.io/graphql',
  fetchOptions: {
    method: 'POST',
    headers,
  },
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

/**
 * To create a route you need:
 *
 * 1. Create a new route and receive back its ID;
 * 2. Subscribe to route updates in order to receive its details.
 */
client
  .mutation(createRoute)
  .toPromise()
  .then(response => {
    const routeId = response.data.newRoute;
    if (!routeId) return Promise.reject('Could not retrieve Route ID. The response is not valid.');

    const { unsubscribe } = pipe(
      client.executeSubscription(createRequest(routeUpdate, { id: routeId })),
      subscribe(result => {
        const { status, route } = result.data?.routeUpdatedById;

        // you can keep listening to the route changes to update route information
        // for this example we want to only draw the initial route
        if (status === 'done' && route) {
          unsubscribe();

          drawRoutePolyline(route); // draw a polyline on a map
        }
      }),
    );
  })
  .catch(error => console.log(error));

let routeData;

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
const drawRoutePolyline = data => {
  const decodedData = mapboxPolyline.decode(data.polyline);
  const reversed = decodedData.map(item => item.reverse());
  routeData = data;

  drawRoute(reversed, data.legs);
  displayRouteData(data);
};

const showAlternativeStationsSwitcher = document.getElementById('showAlternativeStationsSwitcher');
const amountOfAlternativesInfo = document.getElementById('alternativeStationsAmount');
const sliderLabel = document.querySelector('.switch-slider-text');

/**
 * Show journey specific information like duration, consumption etc.
 *
 * @param data {object} route specification
 */
const displayRouteData = data => {
  document.getElementById('loader').remove();
  document.getElementById('showAlternativeStationsSwitcher').removeAttribute('disabled');

  document.querySelector('.tags').style.display = 'flex';

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;

  // the total distance of the route, in meters
  document.getElementById('distance').innerHTML = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';

  // the amount of alternative stations on this route
  document.getElementById('alternativeStationsAmount').innerHTML = 0;

  // the total energy used of the route, in kWh
  document.getElementById('consumption-overview').innerHTML = data.consumption
    ? `${data.consumption.toFixed(2)} kWh`
    : 'Unknown';
};

document.querySelector('.legend-button').addEventListener('click', () => {
  const legend = document.getElementById('legend');
  if (legend.style.display !== 'block') {
    legend.style.display = 'block';
  } else {
    legend.style.display = 'none';
  }
});

showAlternativeStationsSwitcher.addEventListener('input', e => {
  const alternatives = routeData.stationsAlongRoute ?? [];

  if (e.target.checked) {
    amountOfAlternativesInfo.innerHTML = alternatives.length;
    sliderLabel.innerHTML = 'ON';

    showAlternatives(alternatives);
  } else {
    amountOfAlternativesInfo.innerHTML = '0';
    sliderLabel.innerHTML = 'OFF';

    hideAlternatives();
  }
});

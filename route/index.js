import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { pipe, subscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createRoute, routeUpdate } from './queries.js';
import { drawRoute } from './map.js';
import * as mapboxPolyline from '@mapbox/polyline';
import { getDurationString } from '../utils';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
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

    const { unsubscribe } = pipe(
      client.executeSubscription(createRequest(routeUpdate, { id: routeId })),
      subscribe(result => {
        const { status, route } = result.data.routeUpdatedById;

        // you can keep listening to the route changes to update route information
        // for this example we want to only draw the initial route
        if (status === 'done' && route) {
          unsubscribe();

          const routeData = result.data.routeUpdatedById.route;
          drawRoutePolyline(routeData);
          displayRouteData(routeData);
        }
      }),
    );
  })
  .catch(error => console.log(error));

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

  drawRoute(reversed, data.legs);
};

/**
 * Show journey specific information like duration, consumption, costs etc.
 *
 * @param data {object} route specification
 */
const displayRouteData = data => {
  document.getElementById('loader').remove();

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration)} including charging`;

  // the total distance of the route, in meters
  document.getElementById('overview').innerHTML = `${data.distance / 1000} km - ${data.charges} stops`;

  // the total time required to charge of the entire route, in seconds
  document.getElementById('charge-duration').innerHTML = getDurationString(data.chargeTime);

  // the total energy used of the route, in kWh
  document.getElementById('consumption').innerHTML = `${data.consumption.toFixed(2)} kWh`;

  // the money saved by the user driving this route with the electric vehicle
  document.getElementById('cost').innerHTML = `${data.saving.money} ${data.saving.currency || '€'}`;

  // the total amount of CO2 which were used with a petrol vehicle
  document.getElementById('co2').innerHTML = `${data.saving.co2 / 1000}`;
};

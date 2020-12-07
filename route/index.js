import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { pipe, subscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createRoute, routeUpdate, queryRoute } from './queries.js';
import { drawRoute } from './map.js';
import * as mapboxPolyline from '@mapbox/polyline';
import { getDurationString } from '../utils';

/**
 * Example application of how to build a route with the Chargetrip API.
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
        const { status, route } = result.data.routeUpdatedById;

        // you can keep listening to the route changes to update route information
        // for this example we want to only draw the initial route
        if (status === 'done' && route) {
          unsubscribe();
          drawRoutePolyline(route); // draw a polyline on a map
          displayRouteData(route); // fill in the route information
        }
      }),
    );

    // Query for the route once to check if the route is computed before the subscription was setup.
    // In this case we use the response from the query and unsubscribe from the route.
    // For more informations about routes: https://docs.chargetrip.com/#routes
    client
      .query(queryRoute, { id: routeId })
      .toPromise()
      .then(response => {
        const { status, route } = response.data.route;
        if (status === 'done' && route) {
          unsubscribe();
          drawRoutePolyline(route);
          displayRouteData(route);
        }
      });
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

  const driveBtn = document.getElementById('drive');
  driveBtn.removeAttribute('disabled');
  driveBtn.addEventListener('click', () => {
    window.open(getGoogleMapDirectionsURL(data.legs));
  });
};

/**
 * Show journey specific information like duration, consumption, costs etc.
 *
 * @param data {object} route specification
 */
const displayRouteData = data => {
  document.getElementById('loader').remove();
  document.querySelector('.tags').style.display = 'flex';

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;

  // the total distance of the route, in meters
  document.getElementById('distance').innerHTML = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';

  // the amount of stops in this route
  document.getElementById('stop').innerHTML = `${data.charges ?? 0} stops`;

  // the total time required to charge of the entire route, in seconds
  document.getElementById('charge-duration').innerHTML = getDurationString(data.chargeTime ?? 0);

  // the total energy used of the route, in kWh
  document.getElementById('consumption-overview').innerHTML = data.consumption
    ? `${data.consumption.toFixed(2)} kWh`
    : 'Unknown';
  document.getElementById('consumption').innerHTML = data.consumption
    ? `${data.consumption.toFixed(2)} kWh`
    : 'Unknown';

  // the money saved by the user driving this route with the electric vehicle
  document.getElementById('cost').innerHTML = `${data.saving?.currency || '€'} ${data.saving?.money ?? 0} `;

  // the total amount of CO2 which were used with a petrol vehicle
  document.getElementById('co2').innerHTML = data.saving?.co2 ? `${data.saving.co2 / 1000} Kg` : 'Unknown';
};

/**
 * Create a Google Map Directions URL.
 * See documentation here https://developers.google.com/maps/documentation/urls/get-started#directions-action.
 *
 * @param legs Route legs (origin, destination, waypoints and stations)
 * @returns {string} Google Map Directions URL
 */
const getGoogleMapDirectionsURL = legs => {
  if (legs.length === 0) return;

  let googleDirURL = `https://google.com/maps/dir/?api=1`;
  const origin = legs[0].origin?.geometry?.coordinates;
  const destination = legs[legs.length - 1].destination?.geometry?.coordinates;

  // coordinates are an array with longitude as first value and latitude as the second one
  // we have to reverse it as Google Maps accept latitude first
  googleDirURL += `&origin=${origin?.reverse()?.join(',')}&destination=${destination?.reverse()?.join(',')}`;

  if (legs.length > 2) {
    googleDirURL += `&waypoints=`;
    legs.map((leg, index) => {
      // add charging stations and waypoints
      if (index !== legs.length - 1) {
        googleDirURL += `${leg.destination?.geometry?.coordinates?.reverse()?.join(',')}|`;
      }
    });
  }

  googleDirURL += `&dir_action=navigate&travelmode=driving`;

  return encodeURI(googleDirURL);
};

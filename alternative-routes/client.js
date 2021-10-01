import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { pipe, subscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createRoute, routeUpdate } from './queries.js';
import { decodePolylines } from './map.js';
import { renderRouteDetails, renderRouteHeader, renderTabData } from './interface.js';

/**
 * For the purpose of this example we use urql - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  //Replace this x-client-id with your own to get access to more station data
  'x-client-id': '5ed1175bad06853b3aa1e492',
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
export const getRoute = () => {
  client
    .mutation(createRoute)
    .toPromise()
    .then(response => {
      const routeId = response.data.newRoute;
      if (!routeId) return Promise.reject('Could not retrieve Route ID. The response is not valid.');

      const { unsubscribe } = pipe(
        client.executeSubscription(createRequest(routeUpdate, { id: routeId })),
        subscribe(result => {
          const { status, route, alternatives } = result.data.routeUpdatedById;

          // you can keep listening to the route changes to update route information
          // for this example we want to only draw the initial route
          if (status === 'done' && route) {
            unsubscribe();
            decodePolylines(route, alternatives); // draw a polyline on a map

            renderTabData(route, alternatives); // Set the tab times
            renderRouteHeader(route); // Render header HTML data
            renderRouteDetails(route); // fill in the route information
          }
        }),
      );
    })
    .catch(error => console.log(error));
};

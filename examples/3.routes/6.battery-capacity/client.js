import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { createRoute, routeUpdate } from './queries';
import { pipe, subscribe } from 'wonka';

/**
 * For the purpose of this example we use urql - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  //Replace this x-client-id and app-id with your own to get access to more cars
  'x-client-id': '5ed1175bad06853b3aa1e492',
  'x-app-id': '623998b2c35130073829b2d2',
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
 * The function that makes a route request to the Chargetrip API with the customized battery capacity.
 * @param { number } capacity - The current battery capacity
 * @param { function } callback - As soon as our asynchronous call is finished we do a callback to update our UI.
 */
export const getRoute = (capacity, callback) => {
  client
    .mutation(createRoute, { capacity: capacity })
    .toPromise()
    .then(response => {
      const routeId = response.data.newRoute;

      const { unsubscribe } = pipe(
        client.executeSubscription(createRequest(routeUpdate, { id: routeId })),
        subscribe(result => {
          const { status, route } = result.data?.routeUpdatedById;

          // You can keep listening to the route changes to update route information.
          // For this example we want to only draw the initial route.
          if (status === 'done' && route) {
            unsubscribe();
            callback(route);
          } else if (status === 'not_found') {
            callback();
          }
        }),
      );
    })
    .catch(error => console.log(error));
};

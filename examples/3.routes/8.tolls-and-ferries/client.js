import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createClient, defaultExchanges, subscriptionExchange, createRequest } from '@urql/core';
import { createRouteQuery, routeUpdateSubscription } from './queries';
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

export const getRoute = callback => {
  client
    .mutation(createRouteQuery)
    .toPromise()
    .then(response => {
      const routeId = response.data.newRoute;

      const { unsubscribe } = pipe(
        client.executeSubscription(createRequest(routeUpdateSubscription, { id: routeId })),
        subscribe(result => {
          const { status, route } = result.data?.routeUpdatedById;
          // Subscription used as computation time can increase for longer routes.
          if (status === 'done' && route) {
            unsubscribe();
            callback(route);
          }
        }),
      );
    })
    .catch(error => console.log(error));
};

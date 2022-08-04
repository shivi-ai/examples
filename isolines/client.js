import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { createIsoline, isolineSubscription } from './queries';
import { pipe, subscribe } from 'wonka';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  //Replace this x-client-id and app-id with your own to get access to more cars and stations
  'x-client-id': '5ed1175bad06853b3aa1e492',
  'x-app-id': '623998b2c35130073829b2d2',
};

const subscriptionClient = new SubscriptionClient('wss://api.chargetrip.io/graphql', {
  reconnect: true,
  timeout: 4000,
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

/*
 * To create an isoline you need to:
 *
 * 1. create an isoline and receive back its ID;
 * 2. subscribe to isoline updates in order to receive its details.
 */
export const getIsoline = callback => {
  client
    .mutation(createIsoline)
    .toPromise()
    .then(response => {
      const isolineId = response.data.createIsoline;
      const { unsubscribe } = pipe(
        client.executeSubscription(createRequest(isolineSubscription, { id: isolineId })),
        subscribe(result => {
          const { isoline } = result.data;
          // To improve performance please unsubscribe when you have reached a final status.
          if (isoline.status === 'done') {
            unsubscribe();
            callback(isoline);
          } else if (isoline.status === 'not_found') {
            callback();
          }
        }),
      );
    })
    .catch(error => console.log('error', error));
};

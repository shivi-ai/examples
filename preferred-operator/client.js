import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { pipe, subscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { renderOperators } from './interface.js';
import {
  getOperatorListQuery,
  searchOperatorListQuery,
  createRouteQuery,
  routeUpdateSubscription,
  searchOperatorByIdListQuery,
} from './queries.js';
import { drawRoutePolyline } from './map.js';

/**
 * For the purpose of this example we use urql - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives an access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  //Replace this x-client-id with your own to get access to more cars
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
 * Fetches the operator list with pagination but without any arguments.
 * @param { Object } - Object that manages the page and size
 * @param { number } page - Number of the page we are on
 * @param { number } size - Number of operators that we should fetch in one request
 */
export const getOperatorList = ({ page, size = 10 }) => {
  client
    .query(getOperatorListQuery, { page, size })
    .toPromise()
    .then(response => {
      if (response.data.operatorList) {
        renderOperators(response.data.operatorList);
      }
    });
};

/**
 * Searches through our operator list with pagination and various arguments.
 * @param { Object } - Object that manages the page, size and search to be send towards our request
 * @param { number } page - Number of the page we are on
 * @param { number } size - Number of operators that we should fetch in one request
 * @param { string } search - The keywords that we should filter our operator list on
 * @param { boolean } searchById - Boolean whether we should search by name or id
 * @param { function } callback - As soon as our asynchronous call is finished we do a callback to update our UI.
 */
export const searchOperatorList = ({ page, size = 10, search = '', searchById = false }, callback) => {
  client
    .query(searchById ? searchOperatorByIdListQuery : searchOperatorListQuery, { page, size, search })
    .toPromise()
    .then(response => {
      callback(response.data.operatorList);
    });
};

/**
 * Creates a route based on operator preference
 * @param { Object } - Object that manages the operator preference
 * @param { string } type - The type of operator preference. Can be either none, preferred or required.
 * @param { string } [level1] - The first level of operator preference. The higher the more preferred an operator is.
 * @param { string } [level2] - The second level of operator preference.
 * @param { string } [level3] - The third level of operator preference.
 * @param { string } [excluded] - The excluded level of operator preference. These operators won't be used when calculating the route.
 */
export const createRoute = ({ type = 'none', level1 = [], level2 = [], level3 = [], exclude = [] }) => {
  client
    .mutation(createRouteQuery, { type, level1, level2, level3, exclude })
    .toPromise()
    .then(response => {
      const routeId = response.data.newRoute;
      if (!routeId) return Promise.reject('Could not retrieve Route ID. The response is not valid.');

      const { unsubscribe } = pipe(
        client.executeSubscription(createRequest(routeUpdateSubscription, { id: routeId })),
        subscribe(result => {
          const { status, route } = result.data.routeUpdatedById;

          if (status === 'done' && route) {
            unsubscribe();
            drawRoutePolyline(route);
          }
        }),
      );
    })
    .catch(error => console.log(error));
};

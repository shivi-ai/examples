import { createClient, defaultExchanges } from '@urql/core';
import { getCarList } from './queries.js';
import { displayCarsData } from './cars';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives an access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  'x-client-id': '5e8c22366f9c5f23ab0eff39',
};

const client = createClient({
  url: 'https://api.chargetrip.io/graphql',
  fetchOptions: {
    method: 'POST',
    headers,
  },
  exchanges: [...defaultExchanges],
});

/**
 * You can access a list of all available cars using the `carList` query.
 * In this example we use our playground, which has only 4 card available.
 * Chargetrip operates an extensive database of EV makes, editions, and versions, each with their specific consumption models.
 * You need a registered x-client-id to access the full car database.
 * Contact us if you are interested in working with the full database.
 * **/
client
  .query(getCarList)
  .toPromise()
  .then(response => {
    displayCarsData(response.data.carList);
  })
  .catch(error => console.log(error));

import { createClient, defaultExchanges } from '@urql/core';
import { getCarListQuery, getCarDetailsQuery } from './queries.js';
import { renderCarList } from './interface';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives an access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  //Replace this x-client-id and app-id with your own to get access to more cars
  'x-client-id': '5ed1175bad06853b3aa1e492',
  'x-app-id': '623998b2c35130073829b2d2',
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
 * In this example we use our playground, which has only 12 cars available.
 * Chargetrip operates an extensive database of EV makes, editions, and versions,
 * each with their specific consumption models.
 * You need a registered x-client-id to access the full car database.
 * You can obtain a registered x-client-id on https://account.chargetrip.com/
 * **/
export const getCarList = () => {
  client
    .query(getCarListQuery)
    .toPromise()
    .then(response => {
      renderCarList(response.data?.carList);
    })
    .catch(error => console.log(error));
};

/**
 * You can access more detailed information of a specific car using the `car` query.
 * This set of data is a limited set of everything that is available.
 * If you need more you can contact us to get access to our `carPremium` query.
 * @param { string } carId - the id of the car that we want the details of
 */
export const getCarDetails = (carId, callback) => {
  client
    .query(getCarDetailsQuery, { carId })
    .toPromise()
    .then(response => {
      callback(response.data);
    })
    .catch(error => console.log(error));
};

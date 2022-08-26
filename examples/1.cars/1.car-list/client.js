/* eslint-disable max-len */
import { createClient, defaultExchanges } from '@urql/core';
import { groupCars } from './interface';
import { carListQuery } from './queries';

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
 * The function that handles all our GraphQL networking alongside it's parameters.
 * @param { Object } - Object that manages the page, size and search to be send towards our request
 * @param { number } page - Number of the page we are on
 * @param { number } size - Number of cars that we should fetch in one request
 * @param { string } search - The keywords that we should filter our car list on
 * @param { array } availability - An array of availability statuses, currently only picking up cars that are no longer for sale or currently active.
 */
export const getCarList = ({ page, size = 10, search = '', availability = [0, 1] }) => {
  client
    .query(carListQuery, { page, size, search, availability })
    .toPromise()
    .then(response => {
      groupCars(response.data?.carList);
    })
    .catch(error => console.log(error));
};

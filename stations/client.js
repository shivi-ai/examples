import { createClient, defaultExchanges } from '@urql/core';
import { getStationsAroundQuery } from './queries.js';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
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
 * In this example we fetch the closest stations within a radius of 3000 meters
 */
export const getStations = ({ distance = 3000, power = [], amenities = [] }) => {
  return client
    .query(getStationsAroundQuery, {
      query: {
        location: { type: 'Point', coordinates: [10.197422, 56.171395] },
        distance,
        power,
        amenities,
      },
    })
    .toPromise()
    .then(response => {
      return response.data?.stationAround;
    })
    .catch(error => console.log(error));
};

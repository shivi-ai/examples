import { createClient, defaultExchanges } from '@urql/core';
import { getStationData, getStationsAround } from './queries';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
  'x-client-id': '5ed1175bad06853b3aa1e492',
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
 * Fetch 20 station around the city center of Hamburg, Germany.
 * We set the radius around the geolocation in which we fetch stations to 3km
 */
export const fetchStations = () =>
  client
    .query(getStationsAround, {
      query: {
        location: { type: 'Point', coordinates: [9.9801115, 53.5475679] },
        distance: 3000,
      },
    })
    .toPromise()
    .then(response => {
      return response.data?.stationAround;
    })
    .catch(error => console.log(error));

/**
 * Fetch the detail data of a specific station
 * @param { string } id - the id of the station
 */
export const fetchStationData = id =>
  client
    .query(getStationData, {
      stationId: id,
    })
    .toPromise()
    .then(response => {
      return response.data;
    })
    .catch(error => console.log(error));

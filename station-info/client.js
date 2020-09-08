import { createClient, defaultExchanges } from '@urql/core';
import { getStationData, getStationsAround } from './queries';
import { showError } from './station';

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
 * In this example we fetch 20 station around the Hamburg center, Germany.
 */
export const fetchStations = () =>
  client
    .query(getStationsAround, {
      query: {
        location: { type: 'Point', coordinates: [9.9801115, 53.5475679] },
        distance: 300000,
      },
    })
    .toPromise()
    .then(response => {
      return response.data?.stationAround;
    })
    .catch(error => console.log(error));

/**
 * Fetch station data by its ID
 */
export const fetchStationData = id =>
  client
    .query(getStationData, {
      stationId: id,
    })
    .toPromise()
    .then(response => {
      if (!response.data.station) {
        throw Error(response.errors?.[0]?.message || 'No data, please check Network tab for more details.');
      }

      return response.data;
    })
    .catch(error => showError(error));

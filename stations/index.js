import { createClient, defaultExchanges } from '@urql/core';
import { getStationsAround } from './queries.js';
import { showStations, showCenter } from './map.js';
import { initFilters } from './filters.js';

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
 * In this example we fetch the closest stations around Oudekerksplein, 1012 GZ Amsterdam, Noord-Holland, Netherlands
 * with a radius of 3000 meters
 */
const fetchStations = ({ distance, power, amenities }) =>
  client
    .query(getStationsAround, {
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

/**
 * Display statins on the map
 **/
const displayMap = filters => {
  fetchStations(filters)
    .then(stations => {
      showCenter();
      showStations(stations);
    })
    .catch(error => console.log(error));
};

initFilters(displayMap);

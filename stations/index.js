import { createClient, defaultExchanges } from '@urql/core';
import { getStationsAround } from './queries.js';
import { loadStation, showCenter } from './map.js';
import { initFilters } from './filters.js';

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
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
 * In this example we fetch the closest stations around Oudekerksplein, 1012 GZ Amsterdam, Noord-Holland, Netherlands
 * with a radius of 5000 meters
 */
const fetchStations = ({ distance, power, amenities }) =>
  client
    .query(getStationsAround, {
      query: {
        location: { type: 'Point', coordinates: [4.8979755, 52.3745403] },
        distance,
        power,
        amenities,
      },
    })
    .toPromise()
    .then(response => {
      return response.data.stationAround;
    })
    .catch(error => console.log(error));

/**
 * Display statins on the map
 **/
const displayMap = filters => {
  fetchStations(filters)
    .then(stations => {
      showCenter();
      loadStation(stations);
    })
    .catch(error => console.log(error));
};

initFilters(displayMap);

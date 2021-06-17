import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { pipe, subscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createRoute, routeUpdate } from './queries.js';
import { drawRoute } from './map.js';
import * as mapboxPolyline from '@mapbox/polyline';
import { getDurationString } from '../utils';

/**
 * Example application of how to build a route with the Chargetrip API.
 * Please have a look to Readme file in this repo for more details.
 *
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */
const headers = {
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
 * To create a route you need:
 *
 * 1. Create a new route and receive back its ID;
 * 2. Subscribe to route updates in order to receive its details.
 */
client
  .mutation(createRoute)
  .toPromise()
  .then(response => {
    const routeId = response.data.newRoute;
    if (!routeId) return Promise.reject('Could not retrieve Route ID. The response is not valid.');

    const { unsubscribe } = pipe(
      client.executeSubscription(createRequest(routeUpdate, { id: routeId })),
      subscribe(result => {
        const { status, route } = result.data.routeUpdatedById;

        // you can keep listening to the route changes to update route information
        // for this example we want to only draw the initial route
        if (status === 'done' && route) {
          unsubscribe();
          drawRoutePolyline(route); // draw a polyline on a map
          displayRouteData(route); // fill in the route information
        }
      }),
    );
  })
  .catch(error => console.log(error));

/**
 * Draw a route on a map.
 *
 * Route object contains `polyline` data -  the polyline encoded route (series of coordinates as a single string).
 * We need to decode this information first. We use Mapbox polyline tool (https://www.npmjs.com/package/@mapbox/polyline) for this.
 * As a result of decoding we get pairs [latitude, longitude].
 * To draw a route on a map we use Mapbox GL JS. This tool uses the format [longitude,latitude],
 * so we have to reverse every pair.
 *
 * @param data {object} route specification
 */
const drawRoutePolyline = data => {
  const decodedData = mapboxPolyline.decode(data.polyline);
  const reversed = decodedData.map(item => item.reverse());

  drawRoute(reversed, data.legs);

  const driveBtn = document.getElementById('drive');
  driveBtn.removeAttribute('disabled');
  driveBtn.addEventListener('click', () => {
    window.open(getGoogleMapDirectionsURL(data.legs));
  });
};

/**
 * Show journey specific information like duration, consumption, costs etc.
 *
 * @param data {object} route specification
 */
const displayRouteData = data => {
  // the total distance of the route, in meters converted to km
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';

  // the amount of stops in this route
  const routeStops = `${data.charges ?? 0} stops`;

  // the total energy used of the route, in kWh
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  // the average temperature based on all stops across the route
  const averageTemperature = calculateAverageTemperature(data);

  const hasBorderCrossing = checkBorderCrossing(data);

  // A combined field containing several of the route meta data
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;

  // the total duration of the journey (including charge time), in seconds
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;

  // the total time required to charge of the entire route, in seconds
  document.getElementById('charge-duration').innerHTML = getDurationString(data.chargeTime ?? 0);

  // the total energy used of the route, in kWh
  document.getElementById('consumption').innerHTML = routeEnergy;

  // the money saved by the user driving this route with the electric vehicle
  document.getElementById('cost').innerHTML = `${data.saving?.currency || '€'} ${data.saving?.money ?? 0} `;

  // the total amount of CO2 which were used with a petrol vehicle
  document.getElementById('co2').innerHTML = data.saving?.co2 ? `${data.saving.co2 / 1000} Kg` : 'Unknown';

  // Enable or disable our border-crossing UI
  document.getElementById('border-crossing').style.display = hasBorderCrossing ? 'flex' : 'none';

  // A rendering of the average temperature on a specific route
  const averageTemperatureTag = document.getElementById('average-temperature');
  averageTemperatureTag.innerHTML = `${averageTemperature} ºC`;

  // Set the temperature tag color based on the temperature
  if (averageTemperature < 0) {
    averageTemperatureTag.classList.add('blue');
  } else if (averageTemperature > 23) {
    averageTemperatureTag.classList.add('red');
  } else {
    averageTemperatureTag.classList.add('gray');
  }
};

/**
 * Calculate the average temperature by adding up all temperatures across every stop
 * and dividing them by the number of stations.
 * @param { object } data - route specification
 * @returns { int } - average temperature rounded across all stops to 1 decimal
 */
const calculateAverageTemperature = data => {
  let averageTemperature = 0;

  // Go over every leg in our route and get the temperature on every stop origin.
  // To prevent an overlap on the last leg we select the destination.
  // We then add up all the temperatures into one variable.
  data.legs.map((legs, idx) => {
    averageTemperature +=
      idx === data.legs.length - 1 ? Number(legs.destination.properties.temp) : Number(legs.origin.properties.temp);
  });

  // Average out the temperature by dividing it through all stops and round the value to 1 decimal
  return (averageTemperature / data.legs.length).toFixed(1);
};

/**
 * Check whether our route crosses a border based on country names.
 * @param { object } data - route specification
 * @returns { boolean } - whether we are still in the same country our not.
 */
const checkBorderCrossing = data => {
  // Get the country from the origin and destination name.
  var origin = data.legs[0].origin.properties.name.split(', ');
  var destination = data.legs[data.legs.length - 1].destination.properties.name.split(', ');

  // Compare the origins country to the destination country. If they are unequal we have a border-crossing.
  return origin.pop() !== destination.pop();
};

/**
 * Create a Google Map Directions URL.
 * See documentation here https://developers.google.com/maps/documentation/urls/get-started#directions-action.
 *
 * @param legs Route legs (origin, destination, waypoints and stations)
 * @returns {string} Google Map Directions URL
 */
const getGoogleMapDirectionsURL = legs => {
  if (legs.length === 0) return;

  let googleDirURL = `https://www.google.com/maps/dir/?api=1`;
  const origin = legs[0].origin?.geometry?.coordinates;
  const destination = legs[legs.length - 1].destination?.geometry?.coordinates;

  // coordinates are an array with longitude as first value and latitude as the second one
  // we have to reverse it as Google Maps accept latitude first
  googleDirURL += `&origin=${origin?.reverse()?.join(',')}&destination=${destination?.reverse()?.join(',')}`;

  if (legs.length > 2) {
    googleDirURL += `&waypoints=`;
    legs.map((leg, index) => {
      // add charging stations and waypoints
      if (index !== legs.length - 1) {
        googleDirURL += `${leg.destination?.geometry?.coordinates?.reverse()?.join(',')}|`;
      }
    });
  }

  googleDirURL += `&dir_action=navigate&travelmode=driving`;

  return encodeURI(googleDirURL);
};

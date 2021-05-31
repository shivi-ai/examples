import { createClient, createRequest, defaultExchanges, subscriptionExchange } from '@urql/core';
import { pipe, subscribe } from 'wonka';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createRoute, routeUpdate, queryRoute } from './queries.js';
import { drawRoutes } from './map.js';
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
        const { status, route, alternatives } = result.data.routeUpdatedById;

        // you can keep listening to the route changes to update route information
        // for this example we want to only draw the initial route
        if (status === 'done' && route) {
          unsubscribe();
          renderTabData(route, alternatives); // Set the tab times
          decodePolylines(route, alternatives); // draw a polyline on a map
          renderRouteHeader(route); // Render header HTML data
          renderRouteDetails(route); // fill in the route information
        }
      }),
    );

    // Query for the route once to check if the route is computed before the subscription was setup.
    // In this case we use the response from the query and unsubscribe from the route.
    // For more informations about routes: https://docs.chargetrip.com/#routes
    client
      .query(queryRoute, { id: routeId })
      .toPromise()
      .then(response => {
        const { status, route, alternatives } = response.data.route;

        if (status === 'done' && route) {
          unsubscribe();
          renderTabData(route, alternatives);
          decodePolylines(route, alternatives);
          renderRouteHeader(route);
          renderRouteDetails(route);
        }
      });
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
 * @param { object } route - The fastest route
 * @param { array } alternatives - The alternative route objects
 */
const decodePolylines = (route, alternatives) => {
  const routes = [];

  const decodedData = mapboxPolyline.decode(route.polyline);
  const reversed = decodedData.map(item => item.reverse());

  routes.push({ data: route, polyline: reversed });

  alternatives.map(item => {
    const decoded = mapboxPolyline.decode(item.polyline);
    const itemReversed = decoded.map(item => item.reverse());
    routes.push({ data: item, polyline: itemReversed });
  });

  drawRoutes(routes);
};

/**
 * Small function that sets the time on how much longer the different routes are
 * @param { object } route - The fastest route
 * @param { array } alternatives - The alternative route objects
 */
const renderTabData = (route, alternatives) => {
  const tabsWrapper = document.getElementById('tabs-wrapper');
  const tabHighlighter = document.getElementById('tab-highlighter');
  const routeDurations = alternatives.map(
    alternative => `+${getDurationString(alternative.duration - route.duration)}`,
  );

  routeDurations.unshift('Fastest');
  tabsWrapper.textContent = '';
  tabHighlighter.style.width = `calc(${100 / routeDurations.length}% - 4px)`;

  routeDurations.forEach((routeDuration, idx) => {
    tabsWrapper.insertAdjacentHTML(
      'beforeend',
      `<div class="tab ${idx === 0 ? 'active' : ''}">
        <p>${routeDuration}</p>
      </div>`,
    );
  });
};

/**
 * Function that renders the header details
 * @param { object } data - All available route data
 */
export const renderRouteHeader = data => {
  const routeDistance = data.distance ? `${(data.distance / 1000).toFixed(0)} km` : 'Unknown';
  const routeStops = `${data.charges ?? 0} stops`;
  const routeEnergy = data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown';

  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;
  document.getElementById('route-metadata').innerHTML = `${routeDistance} / ${routeStops} / ${routeEnergy}`;
};

/**
 * Function that renders a list with certainroute details
 * @param { object } data - all available route data
 */
export const renderRouteDetails = data => {
  // Format route data so it is presentable
  const routeDetails = formatRouteDetails(data);

  // Clear the previous rendered details
  document.getElementById('route-details').textContent = '';

  // Loop over the formatted data and render lists inside the HTML
  Object.keys(routeDetails).forEach(key => {
    document.getElementById('route-details').insertAdjacentHTML(
      'beforeend',
      `<li>
        <p>${key}</p>
        <p>${routeDetails[key]}</p>
      </li>`,
    );
  });
};

/**
 * Small helper function that helps us map the route data to data that can be displayed
 * @param { object } data - all available route data
 * @returns formatted data that's ready to render */
const formatRouteDetails = data => {
  return {
    'Charge duration': `${getDurationString(data.chargeTime ?? 0)}`,
    'Saved on fuel': `${data.saving?.currency || '€'}${data.saving?.money ?? 0}`,
    'Total consumption': data.consumption ? `${data.consumption.toFixed(2)} kWh` : 'Unknown',
    'CO2 spared': data.saving?.co2 ? `${data.saving.co2 / 1000} Kg` : 'Unknown',
  };
};

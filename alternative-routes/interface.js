import { getDurationString } from '../utils';

/**
 * Small function that sets the time on how much longer the different routes are
 * @param { object } route - The fastest route
 * @param { array } alternatives - The alternative route objects
 */
export const renderTabData = (route, alternatives) => {
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

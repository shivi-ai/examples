import { getDurationString } from '../../../utils';
import { highlightRoute, routes } from './map';

/**
 * Attach event listeners to our tabs
 */
export const attachEventListeners = () => {
  const routeOptions = document.querySelectorAll('.tab');
  const tabHighlighter = document.getElementById('tab-highlighter');

  routeOptions.forEach((option, index) => {
    option.addEventListener('click', didClickTab.bind(null, index, routeOptions, tabHighlighter));
  });
};

/**
 * Small helper function that sets the font color and tab highlight
 * @param { object } routeOptions - All possible route options that are available in the tabs
 * @param { number } index - Current active index
 * @param { element } tabHighlighter - The highlight element that indicates the active tab
 */
export const tabHandler = (index, routeOptions, tabHighlighter) => {
  routeOptions.forEach(option => option.classList.remove('active'));
  routeOptions[index].classList.add('active');
  tabHighlighter.style.transform = `translateX(calc(${index * 100}% + ${index * 4}px)`;
};

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

/**
 * The function that handles highlighting the correct tab and route when a tab is clicked
 * @param { number } index - The index of the tab clicked
 * @param { HTMLCollection } routeOptions - A collection of tabs
 * @param { HTMLElement } tabHighlighter - The highlight element of the tabs
 * @param { Event } event - The click event
 */
const didClickTab = (index, routeOptions, tabHighlighter, event) => {
  event.preventDefault();
  tabHandler(index, routeOptions, tabHighlighter);
  highlightRoute(index, routes);
};

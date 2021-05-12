import { createClient, defaultExchanges } from '@urql/core';
import { getCarList } from './queries.js';
import { debounce } from './debounce.js';

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 5,
  center: [8.1320104, 52.3758916],
});

/**
 * For the purpose of this example we use urgl - lightweights GraphQL client.
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key in this example is a public one and gives an access only to a part of our extensive database.
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

// Keeps track of the active search keyword. This way we always fetch the right results when using pagination.
let searchKeyword = '';

// Keeps track of which page of cars we are currently on.
let currentPage = 0;

// Keep a full list of sorted cars
let groupedCars = new Map();

// Keep track of what headers we already rendered when doing pagination
let renderedHeaders = [];

// Keep track of which cars we already rendered when doing pagination
let renderedCars = [];

/**
 * The function that handles all our GraphQL networking alongside it's parameters.
 * @param { Object } - Object that manages the page, size and search to be send towards our request
 * @param { number } page - Number of the page we are on
 * @param { number } [size] - Number of cars that we should fetch in one request
 * @param { string } search - The keywords that we should filter our car list on
 * @param { array } availability - An array of availability statuses, currently only picking up cars that are no longer for sale or currently active.
 */
const fetchCars = ({ page, size = 10, search = '', availability = [0, 1] }) => {
  client
    .query(getCarList, { page, size, search, availability })
    .toPromise()
    .then(response => {
      groupCars(groupedCars, response.data?.carList);
    })
    .catch(error => console.log(error));
};

/**
 * A function to group the carlist by make
 * @param { Map } groupedCars - Our current set of already rendered cars grouped by make
 * @param { Object } cars - An array of cars coming from the Chargetrip API
 * @param { string } cars[].naming.make - The make of the car
 */
const groupCars = (groupedCars, cars) => {
  // Loop through all the cars
  cars.forEach(car => {
    // Check whether we have a specific make as a key in our map
    if (groupedCars.has(car.naming.make)) {
      // If we have the specific key in our map extend it's children by adding the car to it
      groupedCars.set(car.naming.make, [...groupedCars.get(car.naming.make), car]);
    } else {
      // If we don't have the specific key in our map add it alongside the car
      groupedCars.set(car.naming.make, [car]);
    }
  });

  // Now that we formatted our data we can start rendering our UI
  renderCarList(groupedCars);
};

/**
 * Render function that constructs or list and list headers.
 * @param { Map } groupedCars - Contains our cars grouped by make
 * @param { string } groupedCars[].header - The header for this specific section (make)
 * @param { Object } groupedCars[].cars - The cars within a specific section
 * @param { string } groupedCars[].cars[].id - The id of the specific car that we are rendering
 */
const renderCarList = groupedCars => {
  groupedCars.forEach((cars, header) => {
    // Check if we are not searching and if we have already rendered the header
    if (searchKeyword === '' && !renderedHeaders.includes(header)) renderHeader(header);

    cars.forEach(car => {
      // Check whether the car has already been rendered or not
      if (!renderedCars.includes(car.id)) {
        renderCar(car);
      }
    });
  });

  // Now that we rendered our UI we can configure our intersection observer that will take
  // care of our endless scroll pagination.
  handleObserving(groupedCars);
};

/**
 * Constructs the header HTML and inserts it into the HTML right before the end of car-list.
 * @param {String} header - The title that we want to render.
 */
const renderHeader = header => {
  // Prevent duplicates by setting the header as rendered
  renderedHeaders.push(header);

  document.getElementById('car-list').insertAdjacentHTML(
    'beforeend',
    `
    <li class="car-list-header">${header}</li>
    `,
  );
};

/**
 * Constructs the car HTML and inserts it into the HTML right before the end of car-list.
 * @param { Object } car - All car properties which we use to render a car list entry
 * @param { string } car.id - The id of the car
 * @param { string } car.naming.chargetrip_version - A Chargetrip version to create destinction between specific models
 * @param { string } car.media.image.thumbnail_url - The url of the car image
 * @param { string } car.naming.model - The name of the model
 * @param { string } car.naming.make - The name of the make
 */
const renderCar = car => {
  // Add the id of the car being rendered to our array
  renderedCars.push(car.id);

  // We insert the new html bottom-up. This way we maintain the right alphabetical order.
  document.getElementById('car-list').insertAdjacentHTML(
    'beforeend',
    `
    <li class="car-list-element">
      <div class="car-list-image">
        <img class="car-image" alt="car image" src="${car.media.image.thumbnail_url}"/>
      </div>
      <div class="car-list-data">
        <p><strong>${car.naming.model} ${car.naming.chargetrip_version || ''}</strong></p>
        <p>${car.naming.make}</p>
      </div>
    </li>
    `,
  );
};

/**
 * Intersection observer
 * The following code takes care of updating our pagination when we scroll through the list
 *
 * 1. We initialize a new intersection observer
 * 2. We attach a callback to our intersection observer that takes care of updating our page and fetching more cars
 * 3. We then use this interaction observer to observe the 3rd last item in our car list
 * 4. If we cross past that object we will call or intersection observer callback to fetch new data
 * 5. The new data will be added to the list and we will repeat this process until we fetched everything
 */

/**
 * A function that manages the state of our observer. It either connects or disconnects to our car list.
 * @param { Map } cars - Contains our cars grouped by make
 */
const handleObserving = groupedCars => {
  // Get every car list element
  let targets = [...document.querySelectorAll('.car-list-element')];

  // Setup our offset that defines when we are going to fetch new data.
  let offset = 3;

  // Before we attach our observer we have to make sure we have data and whether or offset is within range.
  // When we search it might happen that we don't have any results or less than 3.
  // In these scenario's we won't need the observer and can disconnect it.
  if (targets.length - offset > 0 && groupedCars.size) {
    // Attach our observer to the 3rd last element in our list
    // We don't attach it to the last one, because then it will block the scrolling behaviour
    // Now it will fetch and attach before the user is at the end so the scroll interaction feels fluid.
    observer.observe(targets[targets.length - offset]);
  } else {
    // Disconnect the observer when we don't need it anymore
    observer.disconnect();
  }
};

/**
 * The callback of the intersection observer that fetches the new data for us when we reach the end
 * @param { Element } entries - An array of elements that are being observed by our observer
 */
const loadNextPage = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      fetchCars({ page: currentPage, size: 10, search: searchKeyword });
    }
  });
};

// Initialize a new intersection observer with the following options
const options = {
  root: document.getElementById('scroll-area'),
  rootMargin: '0px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(loadNextPage, options);

/**
 * Search
 * The following code takes care of searching for cars.
 *
 * 1. Attaches an event listener to our search inputfield
 * 2. Adds a debounce handler so we don't create too much API calls and view refreshes when the users searches
 * 3. Executes our search request with the page set to 0, size set to 10 and the new search keyword.
 */
document.getElementById('search-area').addEventListener(
  'input',
  debounce(e => {
    // Updates our searchKeyword to reflect our inputfield
    searchKeyword = e.target.value;

    // When we are searching we no longer have a sticky header so we can remove that
    if (searchKeyword !== '') {
      document.getElementsByTagName('header')[0].classList.add('no-shadow');
    }

    // Resets our current page param to 0 so we don't miss any search results
    currentPage = 0;

    // Empties our current car-list so we can replace it with the search results
    document.getElementById('car-list').replaceChildren();

    // Reset our rendered and grouped defaults so we have a clean list to start building our search results.
    renderedCars = [];
    renderedHeaders = [];
    groupedCars.clear();

    // Initializes the search request
    fetchCars({ page: currentPage, size: 10, search: searchKeyword });
  }, 250),
);

// Kicks of the initial load which will use page 0 as our current page and gets back the first 10 cars.
fetchCars({ page: currentPage });

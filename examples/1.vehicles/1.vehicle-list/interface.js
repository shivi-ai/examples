import { debounce } from '../../../utils';
import { getVehicleList } from './client';

// Keeps track of the active search keyword. This way we always fetch the right results when using pagination.
let searchKeyword = '';

// Keeps track of which page of Vehicles we are currently on.
let currentPage = 0;

// Keep a full list of sorted Vehicles
let groupedVehicles = new Map();

// Keep track of what headers we already rendered when doing pagination
let renderedHeaders = [];

// Keep track of which Vehicles we already rendered when doing pagination
let renderedVehicles = [];

/**
 * A function to group the Vehiclelist by make
 * @param { Map } groupedVehicles - Our current set of already rendered Vehicles grouped by make
 * @param { Object } vehicles - An array of vehicles coming from the Chargetrip API
 * @param { string } vehicles[].naming.make - The make of the Vehicles
 */
export const groupVehicles = vehicles => {
  // Loop through all the Vehicles
  vehicles.forEach(vehicle => {
    // Check whether we have a specific make as a key in our map
    if (groupedVehicles.has(vehicle.naming.make)) {
      // If we have the specific key in our map extend it's children by adding the vehicle to it
      groupedVehicles.set(vehicle.naming.make, [...groupedVehicles.get(vehicle.naming.make), vehicle]);
    } else {
      // If we don't have the specific key in our map add it alongside the Vehicles
      groupedVehicles.set(vehicle.naming.make, [vehicle]);
    }
  });

  // Now that we formatted our data we can start rendering our UI
  renderVehicleList(groupedVehicles, vehicles);
};

/**
 * Render function that constructs or list and list headers.
 * @param { Map } groupedVehicles - Contains our Vehicles grouped by make
 * @param { string } groupedVehicles[].header - The header for this specific section (make)
 * @param { Object } groupedVehicles[].vehicles - The vehicles within a specific section
 * @param { string } groupedVehicles[].vehicles[].id - The id of the specific vehicle that we are rendering
 */
const renderVehicleList = (groupedVehicles, vehicles) => {
  groupedVehicles.forEach((vehicles, header) => {
    // Check if we are not searching and if we have already rendered the header
    if (searchKeyword === '' && !renderedHeaders.includes(header)) renderHeader(header);

    vehicles.forEach(vehicle => {
      // Check whether the vehicle has already been rendered or not
      if (!renderedVehicles.includes(vehicle.id)) {
        renderVehicle(vehicle);
      }
    });
  });

  // Now that we rendered our UI we can configure our intersection observer that will take
  // care of our endless scroll pagination.
  handleObserving(groupedVehicles, vehicles);
};

/**
 * Constructs the header HTML and inserts it into the HTML right before the end of vehicle-list.
 * @param {String} header - The title that we want to render.
 */
const renderHeader = header => {
  // Prevent duplicates by setting the header as rendered
  renderedHeaders.push(header);

  document.getElementById('vehicle-list').insertAdjacentHTML(
    'beforeend',
    `
    <li class="vehicle-list-header">${header}</li>
    `,
  );
};

/**
 * Constructs the vehicle HTML and inserts it into the HTML right before the end of vehicle-list.
 * @param { Object } vehicle - All vehicle properties which we use to render a vehicle list entry
 * @param { string } vehicle.id - The id of the vehicle
 * @param { string } vehicle.naming.chargetrip_version - A Chargetrip version to create destinction between specific models
 * @param { string } vehicle.media.image.thumbnail_url - The url of the vehicle image
 * @param { string } vehicle.naming.model - The name of the model
 * @param { string } vehicle.naming.make - The name of the make
 */
const renderVehicle = vehicle => {
  // Add the id of the vehicle being rendered to our array
  renderedVehicles.push(vehicle.id);

  // We insert the new html bottom-up. This way we maintain the right alphabetical order.
  document.getElementById('vehicle-list').insertAdjacentHTML(
    'beforeend',
    `
    <li class="vehicle-list-element">
      <div class="vehicle-list-image">
        <img class="vehicle-image" alt="vehicle image" src="${vehicle.media.image.thumbnail_url}"/>
      </div>
      <div class="vehicle-list-data">
        <p><strong>${vehicle.naming.model} ${vehicle.naming.chargetrip_version || ''}</strong></p>
        <p>${vehicle.naming.make}</p>
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
 * 3. We then use this interaction observer to observe the 3rd last item in our vehicle list
 * 4. If we cross past that object we will call or intersection observer callback to fetch new data
 * 5. The new data will be added to the list and we will repeat this process until we fetched everything
 */

/**
 * A function that manages the state of our observer. It either connects or disconnects to our vehicle list.
 * @param { Map } vehicles - Contains our vehicles grouped by make
 */
const handleObserving = (groupedVehicles, vehicles) => {
  // Get every vehicle list element
  let targets = [...document.querySelectorAll('.vehicle-list-element')];

  // Setup our offset that defines when we are going to fetch new data.
  let offset = 3;

  if (vehicles.length - offset > 0) {
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
      getVehicleList({ page: currentPage, size: 10, search: searchKeyword });
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
 * The following code takes care of searching for vehicles.
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

    // Empties our current vehicle-list so we can replace it with the search results
    document.getElementById('vehicle-list').textContent = '';

    // Reset our rendered and grouped defaults so we have a clean list to start building our search results.
    renderedVehicles = [];
    renderedHeaders = [];
    groupedVehicles.clear();

    // Initializes the search request
    getVehicleList({ page: currentPage, size: 10, search: searchKeyword });
  }, 250),
);

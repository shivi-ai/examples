import { debounce } from '../../../utils';
import { createRoute, fetchOperatorList } from './client';
import { drawRoutePolyline } from './map';

// Keeps track of priority levels
let priorities = new Map([]);

// Keeps track of the current selected operator
let selectedOperator;

// Keeps track of the active search keyword. This way we always fetch the right results when using pagination.
let searchKeyword = '';

// Keeps track of the filters and refetches the list
let countryFilters = [];

// Keeps track of which page of cars we are currently on.
let currentPage = 0;

const loadingToast = document.getElementById('loading-toast');

/**
 * A small helper function that renders the UI for every operator coming from the Chargetrip API.
 * @param { Object } operators - All operators that we fetched from the Chargetrip API
 */
export const renderOperators = operators => {
  operators.forEach(operator => {
    // Check if our operator ID has been assigned a different priority level than no priority.
    // If so we need to render a different UI.
    // This is required for when you start searching and go back to the full overview.
    const priority = priorities.has(operator.id) ? priorities.get(operator.id) : null;

    document.getElementById('operator-list').insertAdjacentHTML(
      'beforeend',
      `<li data-id=${operator.id} class="priority-list-element">
            <div class="priority-list-icon ${priority ? priority.color : ''}">
                <img 
                    alt="${priority ? priority.label : 'No priority'} icon" 
                    src="images/${priority ? priority.icon : 'light-no-priority'}.svg" 
                />
            </div>
            <div class="priority-list-data">
                <p><strong>${operator.name}</strong></p>
                <p class="priority-label">${priority ? priority.label : 'No priority'}</p>
            </div>
            <div class="priority-menu-action">
                <img src="images/open-menu.svg" />
            </div>
        </li>`,
    );
  });

  // We are using pagination by using an intersection observer.
  // If we get a new set of data we validate whether our observer is still required.
  handleObserving(operators);
};

/**
 * Small helper function that assigns all event listeners to the UI
 */
export const attachEventListeners = () => {
  attachMenuEventListener();
  attachMenuItemEventListeners();
  attachButtonEventListeners();
  attachTagEventListeners();
};

/**
 * Event listener which registers a trigger for the priority menu.
 * We assign the event listener on the body so you can click anywhere outside the menu to dismiss.
 */
const attachMenuEventListener = () => {
  document.body.addEventListener('click', didToggleMenu, false);
};

/**
 * Event listener that handles the click on any of the items inside the priority menu
 */
const attachMenuItemEventListeners = () => {
  [...document.querySelectorAll('.priority-action')].forEach((action, index) => {
    action.addEventListener('click', () => {
      closeMenu();
      setPriority(index);
    });
  });
};

/**
 * Event listener on the recalculate button.
 * This way you can first set your priorities and after that we recalculate the route.
 * This prevents unnecessary calls to our API.
 */
const attachButtonEventListeners = () => {
  document.getElementById('recalculate').addEventListener('click', recalculateRoute, false);
};

/**
 * Event listener to handle clicks on country tags
 * By clicking a country we refresh the list and only get operators from that country
 */
const attachTagEventListeners = () => {
  [...document.querySelectorAll('.country-tag')].forEach(tag => {
    tag.addEventListener('click', didToggleTag, false);
  });
};

/**
 * a
 * @param { Event } event - the click event
 */
const didToggleTag = event => {
  const countryCode = event.target.dataset.countryCode;
  const countryIdx = countryFilters.indexOf(countryCode);

  event.target.classList.toggle('active');

  if (countryIdx > -1) {
    countryFilters.splice(countryIdx, 1);
  } else {
    countryFilters.push(countryCode);
  }

  // Resets our current page param to 0 so we don't miss any filter results
  currentPage = 0;

  // Empties our current operator list so we can replace it with the filter results
  document.getElementById('operator-list').textContent = '';

  fetchOperatorList({ page: currentPage, size: 10, search: searchKeyword, countries: countryFilters }, renderOperators);
};

/**
 * Function that toggles the menu from open to close and vice-versa
 * @param { Event } event - The click event.
 */
const didToggleMenu = event => {
  const menu = document.getElementById('priority-menu');
  // When clicking the button we traverse up the dom to get to the actual button.
  const menuButton = event.target.parentNode;

  // Check if we click the menu button and if the menu is already open.
  // If the menu is already open we close it, otherwise open the menu.
  // If we click anywhere else and our menu is open, we close it.
  if (menuButton.classList.contains('priority-menu-action') && !menu.classList.contains('active')) {
    openMenu(menuButton);
    return;
  } else if (menu.classList.contains('active')) {
    closeMenu();
    return;
  }
};

/**
 * Opens and positions the priority menu
 * @param { Element } menuButton - the menu button that has been clicked
 */
const openMenu = menuButton => {
  const menu = document.getElementById('priority-menu');

  // Set the menu on the correct offset and open it
  // We use the scroll area to compute the offset of the item that was clicked
  menu.classList.add('active');
  menu.style.top = `${menuButton.offsetTop}px`;
  menu.style.left = `${menuButton.offsetLeft - menu.clientWidth}px`;

  // Keep the button that was clicked in view, so the user has a visual queue to close the menu.
  menuButton.classList.add('active');

  // Get the operator element that was clicked and assign that to the current selected operator
  selectedOperator = menuButton.parentNode;
};

/**
 * Closes the priority menu
 */
const closeMenu = () => {
  const menu = document.getElementById('priority-menu');
  const menuAction = document.querySelector('.priority-menu-action.active');

  menuAction.classList.remove('active');
  menu.classList.remove('active');
};

/**
 * Set the priority of the operator that was clicked to any of the items that was clicked inside the menu
 * @param { number } index - The index of the item that was clicked inside the menu
 */
const setPriority = index => {
  switch (index) {
    case 0:
      // Unset the priority
      priorities.delete(selectedOperator.dataset.id);
      break;
    case 1:
      // Set the priority to high
      priorities.set(selectedOperator.dataset.id, {
        priority: 'high',
        color: 'priority',
        icon: 'light-high-priority',
        label: 'High priority',
      });
      break;
    case 2:
      // Set the priority to medium
      priorities.set(selectedOperator.dataset.id, {
        priority: 'medium',
        color: 'priority',
        icon: 'light-medium-priority',
        label: 'Medium priority',
      });
      break;
    case 3:
      // Set the priority to low
      priorities.set(selectedOperator.dataset.id, {
        priority: 'low',
        color: 'priority',
        icon: 'light-low-priority',
        label: 'Low priority',
      });
      break;
    default:
      // Set the priority to excluded
      priorities.set(selectedOperator.dataset.id, {
        priority: 'excluded',
        color: 'excluded',
        icon: 'light-exclude-priority',
        label: 'Excluded priority',
      });
      break;
  }

  // When we changed the priority we let the UI reflect it by calling this function
  setPriorityStyling();
};

/**
 * Sets the correct styling based on the priority that was selected inside the priority menu.
 */
const setPriorityStyling = () => {
  const priority = priorities.get(selectedOperator.dataset.id);

  /* eslint-disable */
  selectedOperator.querySelector('.priority-list-icon').className = `priority-list-icon ${
    priority ? priority.color : ''
  }`;
  selectedOperator.querySelector('.priority-list-icon img').src = `images/${
    priority ? priority.icon : 'light-no-priority'
  }.svg`;
  selectedOperator.querySelector('.priority-label').innerHTML = `${priority ? priority.label : 'No priority'}`;
  /* eslint-enable */
};

/**
 * This recalculates the route based upon the new operator selection.
 * It extracts the priorities that were set in the list and formats them to how our API is expecting the data
 * If there are no priorities it just calculates a regular route.
 */
const recalculateRoute = event => {
  event.target.disabled = true;
  loadingToast.style.transform = `translateY(0)`;

  if (priorities.size > 0) {
    const level1 = [];
    const level2 = [];
    const level3 = [];
    const exclude = [];

    // eslint-disable-next-line no-unused-vars
    for (const [id, { priority }] of priorities.entries()) {
      switch (priority) {
        case 'high':
          level1.push(id);
          break;
        case 'medium':
          level2.push(id);
          break;
        case 'low':
          level3.push(id);
          break;
        case 'excluded':
          exclude.push(id);
          break;
        default:
          break;
      }
    }

    /**
     * So by default our operator preference is set to none.
     * Whenever you add a preferred operator you will have to tell our API how you would like to use them; preferred or required.
     * Preferred will prefer the operator ranking when calculating routes
     * Required will require the operator ranking when calculating routes, excluded operators will be ignored
     *
     * Our example only uses level 1 to 3. Our API has 10 levels available for if you want to be more specific.
     * Using a lower level (such as level 7) for the lowest priority makes it less likely for the operator to be used.
     *
     * NOTE: If you try to calculate a route with preferred operators while your type is set to none, you will get no route back.
     * NOTE 2: If you calculate a route with only excluded, set your type to 'none'. Otherwise no route will be returned.
     *
     * More information can be found in our documentation; https://docs.chargetrip.com/API-Reference/Routes/mutate-route#mutation
     */
    createRoute(
      {
        type: level1.length > 0 || level2.length > 0 || level3.length > 0 ? 'preferred' : 'none',
        level1: level1,
        level2: level2,
        level3: level3,
        exclude: exclude,
      },
      route => parseRouteResponse(route),
    );
  } else {
    createRoute({}, route => parseRouteResponse(route));
  }
};

export const parseRouteResponse = route => {
  if (route) {
    drawRoutePolyline(route);
  } else {
    renderErrorToast();
  }

  document.getElementById('recalculate').disabled = false;
  loadingToast.style.transform = `translateY(100%)`;
};

export const renderErrorToast = () => {
  const errorToast = document.getElementById('error-toast');
  errorToast.style.transform = `translateY(0)`;

  setTimeout(() => {
    errorToast.style.transform = `translateY(100%)`;
  }, 3500);
};

/**
 * Intersection observer that checks if we have more pages or that we reached the end.
 * If the end is reached we disconnect the intersection observer.
 * @param { Array<Object> } operators - Set of operators that is being returned from the Chargetrip API
 */
const handleObserving = operators => {
  let targets = [...document.querySelectorAll('.priority-list-element')];
  let offset = 3;

  // Unobserve when there are less than 10 results or we reach the end of the list
  if (operators.length < 10) {
    observer.disconnect();
  } else {
    observer.observe(targets[targets.length - offset]);
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

      fetchOperatorList({ page: currentPage, size: 10, search: searchKeyword }, renderOperators);
    }
  });
};

// Initialize a new intersection observer with the following options
const options = {
  root: document.getElementById('scroll-area'),
  rootMargin: '0px',
  threshold: 1.0,
};

// Intersection observer that handles pagination on the operator list
const observer = new IntersectionObserver(loadNextPage, options);

/**
 * Search
 * The following code takes care of searching for operators
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

    // Resets our current page param to 0 so we don't miss any search results
    currentPage = 0;

    // Empties our current car-list so we can replace it with the search results
    document.getElementById('operator-list').textContent = '';

    fetchOperatorList(
      { page: currentPage, size: 10, search: searchKeyword, countries: countryFilters },
      renderOperators,
    );
  }, 250),
);

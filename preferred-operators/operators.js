import { debounce } from '../utils';
import { createRoute, getOperatorList, searchOperatorList } from './client';

// Keeps track of priority levels
let priorities = new Map([]);

// Keeps track of the current selected operator
let selectedOperator;

// Keeps track of the active search keyword. This way we always fetch the right results when using pagination.
let searchKeyword = '';

// Keeps track of which page of cars we are currently on.
let currentPage = 0;

export const renderOperators = operators => {
  operators.forEach(operator => {
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

  // Now that we rendered our UI we can configure our intersection observer that will take
  // care of our endless scroll pagination.
  handleObserving(operators);
};

export const attachEventListeners = () => {
  attachMenuEventListener();
  attachMenuItemEventListeners();
  attachButtonEventListeners();
};

const attachMenuEventListener = () => {
  document.body.addEventListener('click', toggleMenu, false);
};

const attachMenuItemEventListeners = () => {
  [...document.querySelectorAll('.priority-action')].forEach((action, index) => {
    action.addEventListener('click', () => {
      closeMenu();
      setPriority(index);
      setPriorityStyling();
    });
  });
};

const attachButtonEventListeners = () => {
  document.getElementById('recalculate').addEventListener('click', recalculateRoute, false);
};

const toggleMenu = event => {
  const menu = document.getElementById('priority-menu');
  const menuButton = event.target.parentNode;

  if (menuButton.classList.contains('priority-menu-action') && !menu.classList.contains('active')) {
    openMenu(menuButton);
    return;
  } else if (menu.classList.contains('active')) {
    closeMenu();
    return;
  }

  // Click inside menu handler missing
};

const openMenu = menuButton => {
  const menu = document.getElementById('priority-menu');
  const scroll = document.getElementsByTagName('main')[0];

  menuButton.classList.add('active');

  menu.classList.add('active');
  menu.style.top = `${menuButton.offsetTop - scroll.scrollTop}px`;
  menu.style.left = `${menuButton.offsetLeft - menu.clientWidth}px`;

  selectedOperator = menuButton.parentNode;
};

const closeMenu = () => {
  const menu = document.getElementById('priority-menu');
  const menuAction = document.querySelector('.priority-menu-action.active');

  menuAction.classList.remove('active');
  menu.classList.remove('active');
};

const setPriority = index => {
  switch (index) {
    case 0:
      priorities.delete(selectedOperator.dataset.id);
      break;
    case 1:
      priorities.set(selectedOperator.dataset.id, {
        priority: 'high',
        color: 'priority',
        icon: 'light-high-priority',
        label: 'High priority',
      });
      break;
    case 2:
      priorities.set(selectedOperator.dataset.id, {
        priority: 'medium',
        color: 'priority',
        icon: 'light-medium-priority',
        label: 'Medium priority',
      });
      break;
    case 3:
      priorities.set(selectedOperator.dataset.id, {
        priority: 'low',
        color: 'priority',
        icon: 'light-low-priority',
        label: 'Low priority',
      });
      break;
    default:
      priorities.set(selectedOperator.dataset.id, {
        priority: 'excluded',
        color: 'excluded',
        icon: 'light-exclude-priority',
        label: 'Excluded priority',
      });
      break;
  }
};

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

const recalculateRoute = () => {
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

    createRoute({
      type: level1.length > 0 || level2.length > 0 || level3.length > 0 ? 'preferred' : 'none',
      level1: level1,
      level2: level2,
      level3: level3,
      exclude: exclude,
    });
  } else {
    createRoute({});
  }
};

/**
 * A function that manages the state of our observer. It either connects or disconnects to our car list.
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

      if (searchKeyword !== '') {
        searchOperatorList({ page: currentPage, size: 10, search: searchKeyword }, renderOperators);
      } else {
        getOperatorList({ page: currentPage, size: 10 });
      }
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

    // Reset our rendered and grouped defaults so we have a clean list to start building our search results.

    // Initializes the search request if there is a keyword.
    // If there is no keyword, we fetch the full list from the start
    if (searchKeyword !== '') {
      searchOperatorList({ page: currentPage, size: 10, search: searchKeyword }, renderOperators);
    } else {
      getOperatorList({ page: currentPage, size: 10 });
    }
  }, 250),
);

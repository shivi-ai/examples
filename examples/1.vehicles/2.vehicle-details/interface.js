import { getVehicleDetails } from './client';

/**
 * Constructs the vehicle HTML and inserts it into the HTML right before the end of vehicle-list.
 * @param { Object } vehicles - All 12 vehicles that are available on the free key
 * @param { Object } vehicle - A single vehicle on the vehicles details
 * @param { string } vehicle.id - The id of the vehicle
 * @param { string } vehicle.naming.chargetrip_version - A Chargetrip version to create destinction between specific models
 * @param { string } vehicle.media.image.thumbnail_url - The url of the vehicle image
 * @param { string } vehicle.naming.model - The name of the model
 * @param { string } vehicle.naming.make - The name of the make
 */
export const renderVehicleList = vehicles => {
  vehicles.forEach(vehicle => {
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
  });

  attachEventListeners(vehicles);
};

/**
 * To allow navigation between vehicle list and vehicle details we add a few click handlers.
 */
const attachEventListeners = vehicles => {
  [...document.querySelectorAll('.vehicle-list-element')].forEach((vehicle, index) => {
    vehicle.addEventListener('click', event => {
      didClickVehicle(event, vehicles, index);
    });
  });

  document.getElementById('vehicle-details-back').addEventListener('click', didClickBack);
};

/**
 * Click action that get's triggered when somebody clicks on a vehicle. It also sets a class so our detail page animates in.
 * @param { Event } event - the click event
 * @param { Object } vehicles - list of all the vehicles
 * @param { number } index - index of the clicked element
 */
const didClickVehicle = (event, vehicles, index) => {
  event.preventDefault();

  const detailsPage = document.getElementById('vehicle-details');

  // Remove the current vehicle image sources so they don't show up when navigating to a different vehicle
  document.getElementById('vehicle-details-image').src = '';
  document.getElementById('vehicle-details-brand').src = '';

  // On click we format all the details of the specific vehicle before rendering the UI
  formatVehicleDetails(vehicles[index].id);

  // We show the details page and hide the vehicle list
  detailsPage.classList.add('show');
  [...document.querySelectorAll('.card > *')].forEach(el => {
    el.classList.add('hide');
  });
};

/**
 * Function that allows us to go back from a vehicle detail to the vehicle list
 * @param { Event } event - the click event
 */
const didClickBack = event => {
  event.preventDefault();

  const detailsPage = document.getElementById('vehicle-details');

  // We hide the details page and show the vehicle list
  detailsPage.classList.remove('show');
  [...document.querySelectorAll('.card > *')].forEach(el => {
    el.classList.remove('hide');
  });
};

/**
 * Fetch vehicle details and structure them. After that render the UI.
 * @param { string } vehicleId - the id of the vehicle that was selected
 */
export const formatVehicleDetails = vehicleId => {
  getVehicleDetails(vehicleId, data => {
    const formattedData = formatVehicleData(data);

    renderVehicleImage(data.vehicle.media);
    renderVehicleNamingData(data.vehicle.naming);
    renderVehicleListData('vehicle-details-general', formattedData[0], false);
    renderVehicleListData('vehicle-details-range', formattedData[1], true);
    renderVehicleListData('vehicle-details-performance', formattedData[2], false);
  });
};

/**
 * Function that structures the raw vehicle data into nicely formatted objects
 * @param { object } data - The raw vehicle data coming from the backend
 * @returns - An array with formatted data
 */
const formatVehicleData = data => {
  const generalData = {
    'Chargetrip real range™': `${data.vehicle.range.chargetrip_range.worst} - ${data.vehicle.range.chargetrip_range.best} km`,
    'Usable battery': `${data.vehicle.battery.usable_kwh} kWh`,
    'Fast charging support': data.vehicle.routing.fast_charging_support,
    'Plug Type': data.vehicle.connectors[0].standard,
  };

  const rangeData = {
    City: {
      best: `${data.vehicle.range.best.city} km`,
      worst: `${data.vehicle.range.worst.city} km`,
    },
    Highway: {
      best: `${data.vehicle.range.best.highway} km`,
      worst: `${data.vehicle.range.worst.highway} km`,
    },
    Combined: {
      best: `${data.vehicle.range.best.combined} km`,
      worst: `${data.vehicle.range.worst.combined} km`,
    },
  };

  const performanceData = {
    'Top speed': `${data.vehicle.performance.top_speed ? data.vehicle.performance.top_speed : '-'} km / u`,
    Acceleration: `${data.vehicle.performance.acceleration ? data.vehicle.performance.acceleration : '-'} s`,
  };

  return [generalData, rangeData, performanceData];
};

/**
 * Render the image at the top of the HTML
 * @param { object } imageData - All available image data for the specific vehicle
 */
const renderVehicleImage = imageData => {
  const vehicleImage = document.getElementById('vehicle-details-image');
  const brandImage = document.getElementById('vehicle-details-brand');

  vehicleImage.src = `${imageData.image.url}`;
  brandImage.src = `${imageData.brand.thumbnail_url}`;
};

/**
 * Render the vehicle naming at the top of the HTML
 * @param { object } namingData - All vehicle naming data fields
 */
const renderVehicleNamingData = namingData => {
  const vehicleName = document.getElementById('vehicle-details-name');
  const vehicleVersion = document.getElementById('vehicle-details-version');

  vehicleName.innerHTML = `${namingData.make} ${namingData.model}`;
  vehicleVersion.innerHTML = `${namingData.chargetrip_version}`;
};

/**
 * A function that renders the vehicle data in the HTML elements
 * @param { string } elementId - The HTML element id where we render the data
 * @param { object } data - The formatted data that we want to render in a list or table
 * @param { boolean } isTable - This value defines whether we should render a list or a table
 */
const renderVehicleListData = (elementId, data, isTable) => {
  document.getElementById(elementId).textContent = '';

  // Add table header when rendering a table
  if (isTable) {
    document.getElementById(elementId).insertAdjacentHTML(
      'beforeend',
      `<tr>
        <th>Situation</th>
        <th>Mild 23 ºC</th>
        <th>Cold -10 ºC</th>
      </tr>
      `,
    );
  }

  // Loop over the formatted data and render tables or lists inside the HTML
  Object.keys(data).forEach(key => {
    document.getElementById(elementId).insertAdjacentHTML(
      'beforeend',
      `${
        isTable
          ? `<tr>
          <td>${key}</td>
          <td>${data[key].best}</td>
          <td>${data[key].worst}</td>
        </tr>`
          : `<li>
          <p>${key}</p>
          <p>${data[key]}</p>
        </li>`
      }`,
    );
  });
};

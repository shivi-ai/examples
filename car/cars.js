import { getCarDetails } from './client';

/**
 * Constructs the car HTML and inserts it into the HTML right before the end of car-list.
 * @param { Object } cars - All 12 cars that are available on the free key
 * @param { Object } car - A single car on the cars details
 * @param { string } car.id - The id of the car
 * @param { string } car.naming.chargetrip_version - A Chargetrip version to create destinction between specific models
 * @param { string } car.media.image.thumbnail_url - The url of the car image
 * @param { string } car.naming.model - The name of the model
 * @param { string } car.naming.make - The name of the make
 */
export const renderCarList = cars => {
  cars.forEach(car => {
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
  });

  attachEventHandlers(cars);
};

/**
 * To allow navigation between car list and car details we add a few click handlers.
 */
const attachEventHandlers = cars => {
  const detailsPage = document.getElementById('car-details');

  // Attach event listener to every row in the list that gets the car id on click.
  // It also sets a class so our detail page animates in.
  [...document.querySelectorAll('.car-list-element')].forEach((el, idx) => {
    el.addEventListener('click', e => {
      e.preventDefault();

      // Remove the current car image sources so they don't show up when navigating to a different car
      document.getElementById('car-details-image').src = '';
      document.getElementById('car-details-brand').src = '';

      // On click we format all the details of the specific car before rendering the UI
      formatCarDetails(cars[idx].id);

      // We show the details page and hide the car list
      detailsPage.classList.add('show');
      [...document.querySelectorAll('.card > *')].forEach(el => {
        el.classList.add('hide');
      });
    });
  });

  // Event listener that enables us to go back from the car detail page to the car list view
  document.getElementById('car-details-back').addEventListener('click', e => {
    e.preventDefault();

    // We hide the details page and show the car list
    detailsPage.classList.remove('show');
    [...document.querySelectorAll('.card > *')].forEach(el => {
      el.classList.remove('hide');
    });
  });
};

/**
 * Fetch car details and structure them. After that render the UI.
 * @param { string } carId - the id of the car that was selected
 */
export const formatCarDetails = carId => {
  getCarDetails(carId, data => {
    const formattedData = formatCarData(data);

    renderCarImage(data.car.media);
    renderCarNamingData(data.car.naming);
    renderCarListData('car-details-general', formattedData[0], false);
    renderCarListData('car-details-range', formattedData[1], true);
    renderCarListData('car-details-performance', formattedData[2], false);
  });
};

/**
 * A small helper function that structures the raw car data into nicely formatted objects
 * @param { object } data - The raw car data coming from the backend
 * @returns - An array with formatted data
 */
const formatCarData = data => {
  const generalData = {
    'Chargetrip real range™': `${data.car.range.chargetrip_range.worst} - ${data.car.range.chargetrip_range.best} km`,
    'Real range': `${data.car.range.real} km`,
    'Usable battery': `${data.car.battery.usable_kwh} kWh`,
    'Fast charging support': data.car.routing.fast_charging_support,
    'Plug Type': data.car.connectors[0].standard,
  };

  const rangeData = {
    City: {
      best: `${data.car.range.best.city} km`,
      worst: `${data.car.range.worst.city} km`,
    },
    Highway: {
      best: `${data.car.range.best.highway} km`,
      worst: `${data.car.range.worst.highway} km`,
    },
    Combined: {
      best: `${data.car.range.best.combined} km`,
      worst: `${data.car.range.worst.combined} km`,
    },
  };

  const performanceData = {
    'Top speed': `${data.car.performance.top_speed ? data.car.performance.top_speed : '-'} km / u`,
    Acceleration: `${data.car.performance.acceleration ? data.car.performance.acceleration : '-'} s`,
  };

  return [generalData, rangeData, performanceData];
};

/**
 * Render the image at the top of the HTML
 * @param { object } imageData - All available image data for the specific car
 */
const renderCarImage = imageData => {
  const carImage = document.getElementById('car-details-image');
  const brandImage = document.getElementById('car-details-brand');

  carImage.src = `${imageData.image.url}`;
  brandImage.src = `${imageData.brand.thumbnail_url}`;
};

/**
 * Render the car naming at the top of the HTML
 * @param { object } namingData - All car naming data fields
 */
const renderCarNamingData = namingData => {
  const carName = document.getElementById('car-details-name');
  const carVersion = document.getElementById('car-details-version');

  carName.innerHTML = `${namingData.make} ${namingData.model}`;
  carVersion.innerHTML = `${namingData.chargetrip_version}`;
};

/**
 * A function that renders the car data in the HTML elements
 * @param { string } elementId - The HTML element id where we render the data
 * @param { object } data - The formatted data that we want to render in a list or table
 * @param { boolean } isTable - This value defines whether we should render a list or a table
 */
const renderCarListData = (elementId, data, isTable) => {
  document.getElementById(elementId).replaceChildren();

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

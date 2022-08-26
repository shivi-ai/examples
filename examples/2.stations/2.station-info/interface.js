import {
  ConnectorStatus,
  getConnectorStatusLabel,
  getConnectorIcon,
  getConnectorName,
  getConnectorStatus,
  getParkingType,
} from './utils';
import Chart from 'chart.js/auto';

// Keep chart global so we know whether we need to update or construct the chart.
// Only one instance is allowed to run.
let chart = null;

/**
 * Display raw station data.
 *
 * Additionally:
 *
 *  - provide address of the station as a Google link (see https://developers.google.com/maps/documentation/urls/get-started#search-action)
 *  - provide direction URL via Google (see https://developers.google.com/maps/documentation/urls/get-started#forming-the-directions-url)
 *  - show amenities
 *  - show connectors availability
 *
 * @param { Object } data - all details of the selected station
 **/
export const renderStationData = data => {
  const { station } = data;

  const what3wordsURL = `https://what3words.com/${station.physical_address?.what3Words}`;
  const readableAddress = data.station?.physical_address?.formattedAddress?.join(', ') || '';
  const googleAddress = `https://www.google.com/maps/search/?api=1&query=${station.coordinates?.latitude},${station.coordinates?.longitude}`;
  const directionURL = `https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=${station.coordinates?.latitude},${station.coordinates?.longitude}`;

  // Format the connectors so they can be rendered
  const connectors = station.chargers?.map(charger => {
    const status = getConnectorStatus(charger);
    return {
      name: getConnectorName(charger.standard),
      icon: getConnectorIcon(charger.standard),
      power: charger.power,
      status,
      standard: charger.standard,
      availabilityInfo: `${status === ConnectorStatus.UNKNOWN ? '-' : charger.status.free}/${charger.total}`,
      availabilityLabel: getConnectorStatusLabel(status),
    };
  });

  // Format the station details so it's easy to render
  const details = [
    {
      title: 'Address',
      subtitle: readableAddress,
      url: googleAddress,
    },
    {
      title: 'Operator',
      subtitle: station.operator?.name,
    },
    {
      title: 'Twenty 4 seven',
      subtitle: station.opening_times?.twentyfourseven ? '24/7' : 'Unknown',
    },
    {
      title: 'Parking',
      subtitle: getParkingType(station.parking_type),
    },
    {
      title: 'Station Id',
      subtitle: station.id,
    },
    {
      title: 'What 3 words',
      subtitle: station.physical_address?.what3Words,
      url: what3wordsURL,
    },
  ];

  // Now that we have a navigationURL, enable the navigate button
  const navigateButton = document.getElementById('navigate');
  navigateButton.disabled = false;
  navigateButton.addEventListener('click', () => {
    window.open(directionURL);
  });

  // Render the different parts of the station details
  renderHeader(station);
  renderConnectors(connectors);
  renderAmenities(station.amenities);
  renderDetails(details);
};

/**
 * Render the station name and operator inside the sticky header
 * @param { Object } station - Every bit of station data
 */
const renderHeader = station => {
  document.getElementById('station-name').innerHTML = station.name;
  document.getElementById('station-operator').innerHTML = station.operator?.name;
};

/**
 * Render the connectors and their details on cards based on their status
 * @param { Array } connectors - An array of connectors alongside their details
 */
const renderConnectors = connectors => {
  let connectorList = document.getElementById('connector-list');
  connectorList.textContent = '';

  connectors.forEach(connector => {
    connectorList.insertAdjacentHTML(
      'afterbegin',
      `
        <li class=${connector.status}>
          <div class="charger">
            <div class="charger-plug">
              <img src="images/plugs/${connector.icon}.svg#${connector.icon}"/>
            </div>
 
            <div class="charger-details">
              <div class="row">
                <p>${connector.name}</p>
                <p>${connector.availabilityInfo}</p>
              </div>
              <div class="row">
                <p>${connector.power} kW</p>
                <p>${connector.availabilityLabel}</p>
              </div>
            </div>
          </div>
        </li>
        `,
    );
  });
};

/**
 * Render a horizontal list of amenity icons
 * @param { Object } amenities - an object that contains all amenities and their details
 */
const renderAmenities = amenities => {
  let amenityList = document.getElementById('amenity-list');
  amenityList.textContent = '';

  Object.keys(amenities || {})?.forEach(amenity => {
    amenityList.insertAdjacentHTML(
      'beforeend',
      `
        <li>
        <div class="amenity">
          <svg viewBox="0 0 24 24" height="24" width="24">
            <use xlink:href="images/amenities/${amenity}.svg#${amenity}"></use>
          </svg>
        </div>
        </li>
        `,
    );
  });
};

/**
 * Render a vertical list of station details
 * @param { Object } details - a preformatted object that contains all list data
 */
const renderDetails = details => {
  let stationDetails = document.getElementById('station-details');
  stationDetails.textContent = '';

  details.forEach(detail => {
    stationDetails.insertAdjacentHTML(
      'beforeend',
      `
        <li>
          ${detail.url !== undefined ? `<a target="_blank" href=${detail.url}>` : ``}
            <div class="row">
              <p>${detail.title}</p>
            </div>
            <div class="row">
              <p>${detail.subtitle}</p>
            </div>
          ${detail.url !== undefined ? `</a>` : ``}
        </li>
        `,
    );
  });
};

/**
 * Helper function that handles all clicks and data updates on the day of the week tabs
 * @param { object } data - The occupancy data
 */
export const attachEventListeners = data => {
  const dayOptions = document.querySelectorAll('.tab');
  const tabHighlighter = document.getElementById('tab-highlighter');

  dayOptions.forEach((option, index) => {
    option.addEventListener('click', event => {
      event.preventDefault();
      dayOptions.forEach(option => option.classList.remove('active'));
      dayOptions[index].classList.add('active');
      tabHighlighter.style.transform = `translateX(calc(${index * 100}% + ${index * 4}px)`;
      renderGraph(data, index);
    });
  });
};

/**
 * Function that renders the occupancy data
 * @param { object } data - occupancy data that is coming from our API
 * @param { number } tabbarIndex - current day of the week that is selected
 */
export const renderGraph = (data, tabbarIndex) => {
  const occupancyEl = document.getElementById('occupancy');

  // Check whether we have occupancy data.
  // If there is no data available we hide the occupancy content
  if (!data.length) {
    occupancyEl.style.display = 'none';
    return;
  }

  occupancyEl.style.display = 'block';
  const { labels, occupancyData } = formatGraphData(data, tabbarIndex);

  // Check whether we already have a Chart JS object
  // If not we draw the Graph, otherwise we update the current data.
  if (!chart) {
    drawGraph(labels, occupancyData);
  } else {
    chart.data.labels = labels;
    chart.data.datasets.forEach(dataset => {
      dataset.data = occupancyData;
    });
    chart.update();
  }
};

/**
 * Small helper function to format data to a format that is usable for the graph
 * @param { object } data - occupancy data that is coming from our API
 * @param { number } tabbarIndex - current day of the week that is selected
 * @returns { object } - object that contains labels and formatted data to use inside the graph
 */
const formatGraphData = (data, tabbarIndex) => {
  // Get data for the selected day
  // Map data to new format that supports labels
  const formattedData = data
    .filter(({ weekday }) => weekday === tabbarIndex + 1)
    .map((item, i) => {
      const hour = parseInt(item?.period_begin || '');

      return {
        ...item,
        hour,
        label: i === 0 || i === 23 ? `${hour.toString()}:00` : '',
      };
    });

  // Flatten data so we got one array for labels and one array for data
  const labels = formattedData.map(data => data.label);
  const occupancyData = formattedData.map(data => data.occupancy);

  return { labels, occupancyData };
};

/**
 * Constructs the graph with the correct configuration and initial dataset.
 * @param { array } labels - An array with labels that our graph needs to render
 * @param { array } occupancyData - An array with occupancy integers ranging from 1 - 10
 */
const drawGraph = (labels, occupancyData) => {
  const ctx = document.getElementById('occupancy-graph').getContext('2d');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [
        {
          data: occupancyData,
          fill: true,
          hoverBackgroundColor: 'rgba(0, 120, 255, 1)',
          backgroundColor: 'rgba(0, 120, 255, 0.2)',
          borderRadius: 2,
        },
      ],
      labels: labels,
    },
    options: {
      animations: {
        tension: {
          duration: 300,
          easing: 'linear',
          from: 1,
          to: 0,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          suggestedMax: 10,
          ticks: {
            display: false,
          },
          grid: {
            tickLength: 0,
            borderColor: '#FFFFFF',
            color: '#E5F0F5',
            borderDash: [4, 6],
          },
        },
        x: {
          grid: {
            display: false,
            borderColor: '#E5F0F5',
          },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            color: '#566A75',
            font: {
              family: 'Inter',
              size: 12,
              weight: 600,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: tooltipHandler,
        },
      },
    },
  });
};

/**
 * Small helper function that draws a new element for our custom tooltip
 * @param { Chart } chart - The chart.js main chart property
 * @returns A HTML object that is added to the chart
 */
const renderToolTip = chart => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.classList.add('custom-tooltip');

    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

/**
 * Our external tooltip helper for positioning and formatting the data to show alongside the graph
 * @param { context } context - The canvas context
 */
const tooltipHandler = context => {
  const { chart, tooltip } = context;
  const tooltipEl = renderToolTip(chart);

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  if (tooltip.body) {
    const lines = tooltip.body.map(b => {
      return b.lines.map(line => {
        switch (line) {
          case '1':
            return 'Not busy';
          case '2':
          case '3':
            return 'Not too busy';
          case '4':
          case '5':
            return 'A little busy';
          case '6':
          case '7':
            return 'Busy';
          case '8':
          case '9':
            return 'Very busy';
          case '10':
            return 'Extremely busy';
        }
      });
    });

    tooltipEl.innerHTML = `${lines}`;
  }

  const { offsetLeft: positionX } = chart.canvas;
  const tooltipElWidth = tooltipEl.offsetWidth / 2;

  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = `calc(${positionX + tooltip.caretX}px - ${tooltipElWidth}px)`;
};

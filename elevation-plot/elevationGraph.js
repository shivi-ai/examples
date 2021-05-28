import Chart from 'chart.js/auto';
import { getDurationString } from '../utils';

/**
 * Construct an elevation graph using the points from the elevationPlot.
 * @param { object } route - All route data
 */
export const loadGraph = route => {
  const { elevationPlot, distance } = route;
  const ctx = document.getElementById('elevation-graph').getContext('2d');

  // Set the labels on the x-axis
  const labels = new Array(elevationPlot.length).fill('').map((_, idx) => {
    if (idx === 0) return '0';
    if (idx === elevationPlot.length - 1) return `${(distance / 1000).toFixed(0)}`;

    return '';
  });

  // Hide loader
  document.getElementById('elevation-loader').style.display = 'none';

  // Construct the chart with chart.js and our dataset
  new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          data: elevationPlot,
          fill: true,
          showLine: false,
          backgroundColor: 'rgba(0, 120, 255, 0.2)',
        },
      ],
      labels: labels,
    },
    options: {
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          ticks: {
            display: false,
          },
          grid: {
            tickLength: 0,
            borderColor: '#E5F0F5',
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
      },
      tooltips: {
        display: false,
      },
    },
  });
};

/**
 * Move the elevation indicator to the point on the graph to reflect the position on the polyline.
 * @param { number } position - x position of the indicator
 */
export const positionElevationIndicator = position => {
  const elevationGraph = document.getElementById('elevation-graph');
  const elevationIndicator = document.getElementById('elevation-indicator');

  elevationIndicator.style.display = 'block';
  elevationIndicator.style.marginLeft = position * (elevationGraph.offsetWidth - 10) + 'px';
};

/**
 * Function that renders the header details
 * @param { object } data - All available route data
 */
export const renderRouteHeader = data => {
  document.getElementById('duration').innerHTML = `${getDurationString(data.duration ?? 0)}`;
  document.getElementById('route-metadata').innerHTML = `
    Uphill ${(data.elevationUp / 1000).toFixed(0) ?? 'Unknown'} km / 
    Downhill ${(data.elevationDown / 1000).toFixed(0) ?? 'Unknown'} km
  `;
};

/**
 * Small helper function that renders the data that we want to display when clicking a certain point of the route
 * @param { object } data - Formatted route data that we want to display on the UI
 */
export const renderRouteDetails = data => {
  const routeDetails = document.getElementById('route-details');
  routeDetails.textContent = '';

  // Format the data so it's inline with the HTML
  const formattedData = {
    Elevation: `${data.routePath.elevation} m`,
    'Consumption estimation': `${data.routePath.consumptionPerKm} kWh / km`,
    'Average speed': `${data.routePath.averageSpeed} km / u`,
  };

  // Loop over the formatted data and render tables or lists inside the HTML
  Object.keys(formattedData).forEach(key => {
    routeDetails.insertAdjacentHTML(
      'beforeend',
      `<li>
          <p>${key}</p>
          <p>${formattedData[key]}</p>
        </li>`,
    );
  });
};

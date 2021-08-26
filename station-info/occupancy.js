import Chart from 'chart.js/auto';

// Keep chart global so we know whether we need to update or construct the chart.
// Only one instance is allowed to run.
let chart = null;

/**
 * Helper function that handles all clicks and data updates on the day of the week tabs
 * @param { object } data - The occupancy data
 */
export const addOccupancyListeners = data => {
  const dayOptions = document.querySelectorAll('.tab');
  const tabHighlighter = document.getElementById('tab-highlighter');

  dayOptions.forEach((option, index) => {
    option.addEventListener('click', e => {
      e.preventDefault();
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

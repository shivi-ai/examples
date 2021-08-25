import Chart from 'chart.js/auto';

let chart = null;

/**
 * Helper function to add tab handling on the days of the week
 */
export const addOccupancyListeners = data => {
  const dayOptions = document.querySelectorAll('.tab');
  const tabHighlighter = document.getElementById('tab-highlighter');

  dayOptions.forEach((option, idx) => {
    option.addEventListener('click', e => {
      e.preventDefault();
      dayOptions.forEach(option => option.classList.remove('active'));
      dayOptions[idx].classList.add('active');
      tabHighlighter.style.transform = `translateX(calc(${idx * 100}% + ${idx * 4}px)`;
      formatGraphData(data, idx);
    });
  });
};

/**
 * Small helper function to format data to a format that is usable for the graph
 * @param {*} data - TODO
 */
export const formatGraphData = (data, tabbarIndex) => {
  const occupancyEl = document.getElementById('occupancy');

  if (!data.length) {
    occupancyEl.style.display = 'none';
  } else {
    occupancyEl.style.display = 'block';
  }

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

  const labels = formattedData.map(data => data.label);
  const occupancyData = formattedData.map(data => data.occupancy);

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
          external: externalTooltipHandler,
        },
      },
    },
  });
};

const getOrCreateTooltip = chart => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.classList.add('custom-tooltip');

    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = context => {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

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

import Chart from 'chart.js';

Chart.defaults.global.defaultFontFamily = 'Inter';

/**
 * Create an elevation graph using the points from the elevationPlot.
 *
 * @param route {object} Route data.
 */
export const loadGraph = route => {
  const { elevationPlot } = route;
  const ctx = document.getElementById('elevationGraph').getContext('2d');
  let gradient = ctx.createLinearGradient(0, 0, 0, 180);

  gradient.addColorStop(1, '#fff');
  gradient.addColorStop(0, 'rgba(1, 99, 234, 0.4)');

  const data = {
    labels: createLabelsForElevation(route),
    datasets: [
      {
        label: 'elevation',
        borderColor: '#0078FF',
        borderWidth: 1.5,
        backgroundColor: gradient,
        opacity: 0.9,
        pointRadius: 0,
        data: elevationPlot,
      },
    ],
  };

  const options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            tickMarkLength: 0,
            drawTicks: false,
            drawOnChartArea: false,
            drawBorder: false,
          },
          ticks: {
            min: 0,
            padding: 5,
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,
            fontSize: 13,
            fontStyle: 'bold',
            fontColor: '#404046',
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            tickMarkLength: 0,
            drawTicks: false,
            drawBorder: false,
          },
          ticks: {
            min: 0,
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: -1,
        right: -1,
        top: 0,
        bottom: 0,
      },
    },
    tooltips: {
      enabled: false,
    },
  };

  new Chart(ctx, { type: 'line', data, options });
  displayStationMarkers(route);
};

/**
 * Calculate where the distance labels should be placed.
 * Here we want to display the distance every 100 m.
 * @param route {object} All data requested about the route.
 */
const createLabelsForElevation = route => {
  const distanceInKm = route.distance / 1000;
  const points = route.elevationPlot.length;
  const pos = 100;
  const label = new Array(points).fill('');
  label[0] = 0;
  for (let i = 1; pos * i < distanceInKm; i++) {
    const x = ((pos * i * points) / distanceInKm).toFixed(0);
    label[x] = pos * i;
  }
  return label;
};

/**
 * This function will display the charging stations on top of the elevation graph.
 *
 * @param route {object} All information about the route.
 */
const displayStationMarkers = route => {
  const { legs } = route;
  if (!legs || legs.length === 0) return;

  const amountOfStations = legs.length - 1;
  const elevationGraph = document.getElementById('elevationGraph');
  const chargers = document.getElementById('stationsLayer').getContext('2d');
  const img = new Image();
  let distanceKm = 0;

  img.onload = function() {
    for (let i = 0; i < amountOfStations; i++) {
      distanceKm = distanceKm + legs[i].distance / 1000;
      let x = (distanceKm * elevationGraph.offsetWidth) / (route.distance / 1000);
      chargers.drawImage(img, x - 15, elevationGraph.offsetHeight - 60);
    }
  };

  img.src = 'images/station.svg';
};

/**
 * Move the elevation indicator to a point on the graph to show the current position on the polyline.
 *
 * @param position {number} xAxis position of the indicator.
 */
export const positionElevationIndicator = position => {
  const elevatetionGraph = document.getElementById('elevationGraph');
  document.getElementById('elevationIndicator').style.marginLeft =
    position * (elevatetionGraph.offsetWidth - 10) + 'px';
};

/**
 * Show information about the amout of km we are going up and down on the route.
 *
 * @param elevationUp {number} The total number of meters which are going up on the route.
 * @param elevationDown {number} The total number of meters which are going down on the route.
 */
export const displayElevationData = (elevationUp, elevationDown) => {
  document.getElementById('loader').remove();
  document.getElementById('elevationIndicator').style.display = 'block';

  // The highest point of the elevation plot
  document.getElementById('upHill').innerHTML = `Uphill ${(elevationUp / 1000).toFixed(0) ?? 'Unknown'}km`;

  // The lowest point of the elevation plot
  document.getElementById('downHill').innerHTML = `Downhill ${(elevationDown / 1000).toFixed(0) ?? 'Unknown'}km`;
};

/**
 * Show route path specific information like elevation, consumption, speed etc.
 *
 * @param path {object} route path specification.
 */
export const displaySpecs = path => {
  // The consumption, in kWh, of this route path segment.
  document.getElementById('consumption').innerHTML =
    path.routePath?.consumptionPerKm >= 0 ? `${path.routePath?.consumptionPerKm * 1000} Wh/km` : 'Uknown';

  // The elevation (altitude) in meters for this route path segment.
  document.getElementById('height').innerHTML = path.routePath?.elevation
    ? `${path.routePath?.elevation} m`
    : 'Unknown';

  // The average speed, in km/h, for this route path segment.
  console.log(path);
  document.getElementById('average-speed').innerHTML = path.routePath?.averageSpeed
    ? `${path.routePath?.averageSpeed} km`
    : 'Unknown';
};

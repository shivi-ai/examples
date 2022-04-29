const iframe = document.getElementById('iframe');
const overview = document.getElementById('overview');
const metaDescription = document.querySelector('meta[name="description"]');
const urlParams = new URLSearchParams(window.location.search);
const pageId = urlParams.get('id');
const title = document.getElementById('overview-title');

const examples = [
  {
    id: 'stations-around',
    url: '/stations/',
    title: 'Chargetrip API: Stations around example',
    description: 'Query stations around a GeoJSON point with the Chargetrip API.',
  },
  {
    id: 'station-details',
    url: '/station-info/',
    title: 'Chargetrip API: Station example',
    description: 'Query particular station with the Chargetrip API.',
  },
  {
    id: 'car-list',
    url: '/car-list/',
    title: 'Chargetrip API: Query the car list example',
    description: 'Query the list of cars with Chargetrip API and lazy load the next set',
  },
  {
    id: 'car-details',
    url: '/car/',
    title: 'Chargetrip API: Query the car example',
    description: 'Query the list of cars with Chargetrip API and compare the models',
  },
  {
    id: 'tile-server',
    url: '/tile-server/',
    title: 'Chargetrip API: Tile Service example using the mvt response',
    description:
      'Show charging stations on the map with the Chargetrip API and the mvt response from Chargetrip Tile Service',
  },
  {
    id: 'tile-json',
    url: '/tile-json/',
    title: 'Chargetrip API: Tile Service example using the GeoJSON response',
    description:
      'Show charging stations on the map with the Chargetrip API and the GeoJSON response from Chargetrip Tile Service',
  },
  {
    id: 'route',
    url: '/route/',
    title: 'Chargetrip API: Build a route example',
    description: 'Example of how to request a route and show it on a map.',
  },
  {
    id: 'stations-along-route',
    url: '/stations-along-route/',
    title: 'Chargetrip API: Stations along route example',
    description: 'Build a route with the Chargetrip API and display stations along the route.',
  },
  {
    id: 'alternative-routes',
    url: '/alternative-routes/',
    title: 'Chargetrip API: Alternative routes example',
    description: 'Plot alternative routes between two locations.',
  },
  {
    id: 'preferred-operator',
    url: '/preferred-operator/',
    title: 'Chargetrip API: Preferred operators example',
    description: 'Construct a route based on operator preference or operator exclusion.',
  },
  {
    id: 'elevation-plot',
    url: '/elevation-plot/',
    title: 'Chargetrip API: Elevation plot example',
    description: 'Build a route with the Chargetrip API and show elevation data',
  },
  {
    id: 'state-of-charge',
    url: '/state-of-charge/',
    title: 'Chargetrip API: Impact of SoC changes example',
    description: 'Update a route based on the state of charge at departure',
  },
  {
    id: 'battery-capacity',
    url: '/battery-capacity/',
    title: 'Chargetrip API: Impact of battery capacity changes example',
    description: 'Update a route based on the battery capacity at departure',
  },
];

const page = examples.filter(value => value.id === pageId)[0];

if (page) {
  iframe.src = page.url;

  document.title = page.title;
  metaDescription.setAttribute('content', page.description);
} else {
  iframe.style.display = 'none';
  overview.style.display = 'grid';
  title.style.display = 'block';

  document.title = 'Chargetrip API examples';
  metaDescription.setAttribute(
    'content',
    'Discover how to work with the Chargetrip API by exploring any of our examples.',
  );
}

const isLoggedIn = () => {
  const signIn = document.getElementById('sign-in');
  const signUp = document.getElementById('sign-up');

  const cookies = document.cookie;
  const accessToken = cookies.match('(^|;)\\s*' + 'access_token' + '\\s*=\\s*([^;]+)')?.pop();

  if (accessToken === undefined) return;

  signUp.remove();
  signIn.href = 'https://account.chargetrip.com/';
  [...signIn.childNodes][1].style.stroke = '#0078FF';
  [...signIn.childNodes][3].innerHTML = 'Account';
};

isLoggedIn();

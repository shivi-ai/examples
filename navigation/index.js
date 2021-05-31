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
    title: 'Chargetrip API: stations around example',
    description: 'Query stations around a GeoJSON point with the Chargetrip API.',
  },
  {
    id: 'station-details',
    url: '/station-info/',
    title: 'Chargetrip API: station example',
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
    title: 'Chargetrip API: Tile Service example',
    description: 'Show charging stations on the map with the Chargetrip API and the Chargetrip Tile Service',
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
    title: 'Chargetrip API: stations along route example',
    description: 'Build a route with the Chargetrip API and display stations along the route.',
  },
  {
    id: 'alternative-routes',
    url: '/alternative-routes/',
    title: 'Chargetrip API: alternative routes example',
    description: 'Plot alternative routes between two locations.',
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
    title: 'Chargetrip API: example of the impact of your SOC',
    description: 'Update a route based on the state of charge at departure',
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

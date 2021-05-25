import mapboxgl from 'mapbox-gl';
import { getCarList } from './client';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjazhpaG8ydTIwNWNpM21ud29xeXc2amhlIn0.rGKgR3JfG9Z5dCWjUI_oGA';

new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
  zoom: 5,
  center: [8.1320104, 52.3758916],
});

getCarList();

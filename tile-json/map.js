import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';
import { GOOGLE_MAPS_TOKEN } from '@env';

/**
 * This example shows how to use the GeoJSOn response from our Vector Tile Server with Google Maps
 *
 * To establish a connection with Chargetrip GraphQL API you need to have an API key.
 * The key sin this example is are public ones and gives access only to a part of our extensive database.
 * You need a registered `x-client-id` to access the full database.
 * Read more about an authorisation in our documentation (https://docs.chargetrip.com/#authorisation).
 */

// Add your own API Key in your .env file
const loader = new Loader({ apiKey: GOOGLE_MAPS_TOKEN });

let map;
let markers = [];

async function displayMap() {
  const google = await loader.load();

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3.5,
    center: { lat: 52.367, lng: 4.8979755 },
    disableDefaultUI: true,
  });

  map.addListener('zoom_changed', () => {
    hideMarkers();
  });

  addPolygon(google);

  var maptiles = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      axios
        .get(
          `https://api.chargetrip.io/station/${zoom}/${coord.x}/${coord.y}/tile.json?connectors[]=IEC_62196_T2&connectors[]=IEC_62196_T2_COMBO&connectors[]=TESLA_S&connectors[]=CHADEMO&powerGroups[]=fast&powerGroups[]=turbo`,
          {
            headers: {
              // Replace this x-client-id with your own to get access to more station data
              'x-client-id': '5ed1175bad06853b3aa1e492',
            },
          },
        )
        .then(response => {
          if (response.data) {
            for (let i = 0; i < response.data.features?.length; i++) {
              const feature = response.data.features[i];
              if (feature.properties?.count > 1) {
                addClusterMarker(google, feature);
              } else {
                addStationMarker(google, response.data.features[i]);
              }
            }
          }
        });
    },
    tileSize: new google.maps.Size(256, 256),
  });

  map.overlayMapTypes.insertAt(0, maptiles);
}

/**
 * Our ecomovement data is limited on our free key.
 * We draw a polygon using this function to show what area of data is available for free.
 */
function addPolygon(google) {
  const outerCoords = [
    { lat: -85, lng: -180 },
    { lat: 85, lng: -180 },
    { lat: 85, lng: 180 },
    { lat: -85, lng: 180 },
    { lat: -85, lng: 0 },
  ];

  const innerCoords = [
    { lat: 61, lng: 7.8 },
    { lat: 45, lng: 7.8 },
    { lat: 45, lng: 11.3 },
    { lat: 61, lng: 11.3 },
  ];

  new google.maps.Polygon({
    paths: [outerCoords, innerCoords],
    strokeWeight: 0.1,
    fillColor: '#282A30',
    fillOpacity: 0.6,
    map,
  });
}

/**
 * Add marker for the clustered stations
 */
function addClusterMarker(google, feature) {
  const coords = feature.geometry.coordinates;

  const marker = new google.maps.Marker({
    position: { lat: coords[0], lng: coords[1] },
    map: map,
    icon: `images/free.svg`,
    label: {
      text:
        feature.properties.count < 1000
          ? `${feature.properties.count}`
          : `${Math.round(feature.properties.count / 1000)} K`,
      color: 'white',
      fontSize: '10px',
    },
  });

  marker.addListener('click', () => {
    map.setZoom(feature.properties.expansionZoom);
    map.setCenter({ lat: coords[0], lng: coords[1] });
  });

  markers.push(marker);
}

/**
 * Add marker for stations
 */
function addStationMarker(google, feature) {
  const coords = feature.geometry.coordinates;

  const marker = new google.maps.Marker({
    position: { lat: coords[0], lng: coords[1] },
    map: map,
    icon: `images/${feature.properties.status}.svg`,
  });
  marker.addListener('click', () => {
    map.setZoom(feature.properties.expansionZoom);
    map.setCenter({ lat: coords[0], lng: coords[1] });
  });

  const speed = new google.maps.Marker({
    position: marker.getPosition(),
    map: map,
    scale: 0.5,
    icon: `images/${feature.properties.speed}.svg`,
  });
  marker.bindTo('origin', speed);

  markers.push(marker);
  markers.push(speed);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function hideMarkers() {
  setMapOnAll(null);
  markers = [];
}

export { displayMap };

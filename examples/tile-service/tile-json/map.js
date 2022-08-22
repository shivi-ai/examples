import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_TOKEN } from '@env';
import { getTiles } from './client';

/**
 * This example illustrates how the GeoJSON response from the tile service can be used in combination with Google Maps.
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

  var mapTiles = new google.maps.ImageMapType({
    getTileUrl: async (coord, zoom) => {
      const data = await getTiles(coord, zoom);

      if (data.features) {
        for (let i = 0; i < data.features?.length; i++) {
          const feature = data.features[i];
          if (feature.properties?.count > 1) {
            addClusterMarker(google, feature);
          } else {
            addStationMarker(google, data.features[i]);
          }
        }
      }
    },
    tileSize: new google.maps.Size(256, 256),
  });

  map.overlayMapTypes.insertAt(0, mapTiles);
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

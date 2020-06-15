import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/ck98fwwp159v71ip7xhs8bwts',
  zoom: 11,
  center: [4.8979755, 52.3745403],
});

const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.on('mouseenter', 'path', e => {
  map.getCanvas().style.cursor = 'pointer';

  let coordinates = e.features[0].geometry.coordinates;
  let description = e.features[0].properties.description;

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  popup
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

map.on('mouseleave', 'path', function() {
  map.getCanvas().style.cursor = '';
  popup.remove();
});

/**
 * Return what icon will be used to display the charging station, depending on the speed and status.
 *
 * @param point {array} Array containing station data
 */
const selectPinlet = point => {
  const statusVals = ['available', 'unknown', 'broken'];
  const speedVals = ['slow', 'fast'];

  let status = statusVals.includes(point.status) ? point.status : 'in-use';
  let speed = speedVals.includes(point.speed) ? point.speed : 'turbo';

  return `${status}-${speed}`;
};

/**
 * Draw the stations on the map and show data about the station on hover.
 *
 * @param stations {array} Array of stations
 */

const loadStation = stations => {
  const points = stations.map(point => ({
    type: 'Feature',
    properties: {
      icon: selectPinlet(point),
      description: point.address,
    },
    geometry: point.location,
  }));

  map.addLayer({
    id: 'path',
    type: 'symbol',
    layout: {
      'icon-image': '{icon}',
      'icon-allow-overlap': true,
      'icon-size': 0.55,
    },
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: points,
      },
    },
  });
};

export { loadStation };

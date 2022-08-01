import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/cjz4ahqxb02ty1cplt79y49j2',
  zoom: 7.0,
  center: [8.6821, 50.1109],
});

/**
 * Draw isolines on a map.
 *
 * An isoline object contains `polygon` data
 * The polygon has geometry data with coordinates that can be renered on map.
 * We can use the polygon_count to get the amunt of polygons availble and loop through all of them.
 *
 * @param data {object} isoline details
 */
export const drawIsoline = data => {
  drawIso(data);
};

/**
 * Draw isolines on the map.
 * @param { object } data - object containing polygon data
 */
export const drawIso = data => {
  var index = 0;
  const loadingToast = document.getElementById('loading-toast');

  if (map.loaded()) {
    console.log('loaded', data);
    while (index < data.polygon_count) {
      addLayer(data.polygons[index].geometry.coordinates, index);
      index = index + 1;
    }
    loadingToast.style.transform = `translateY(100%)`;
  } else {
    map.on('load', () => {
      while (index < data.polygon_count) {
        addLayer(data.polygons[index].geometry.coordinates, index);
        index = index + 1;
      }
      loadingToast.style.transform = `translateY(100%)`;
    });
  }
};

const addLayer = (dataLayer, index) => {
  console.log('data', dataLayer);
  map.addSource(`layer${index}`, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: dataLayer,
      },
    },
  });
  map.addLayer({
    id: `layer${index}`,
    type: 'fill',
    source: `layer${index}`,
    layout: {},
    paint: {
      'fill-color': '#0078ff',
      'fill-opacity': 0.02,
    },
  });
};

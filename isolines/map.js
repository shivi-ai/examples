import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  // style: 'mapbox://styles/chargetrip/ckf2gje0j4n2z19mgubmdk6tx', // Light Map
  // style: 'mapbox://styles/chargetrip/cl2pxb0e2001v15l2tawki0k0', // Dark Map
  style: 'mapbox://styles/chargetrip/ckgcbf3kz0h8819qki8uwhe0k',
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
  console.log(index);

  map.addSource(`layer-${index}`, {
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
    id: `fill-${index}`,
    type: 'fill',
    source: `layer-${index}`,
    layout: {},
    paint: {
      'fill-color': '#0078ff',
      'fill-opacity': 0.12,
    },
  });

  map.addLayer({
    id: `line-${index}`,
    type: 'line',
    source: `layer-${index}`,
    layout: {},
    paint: {
      'line-color': '#0078ff',
      'line-width': 1,
      'line-opacity': index === 4 ? 1 : 0.2, // 1 - (index + 1) * 0.1
    },
  });
};

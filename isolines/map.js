import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmdldHJpcCIsImEiOiJjamo3em4wdnUwdHVlM3Z0ZTNrZmd1MXoxIn0.aFteYnUc_GxwjTLGvB3uCg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/chargetrip/cjz4ahqxb02ty1cplt79y49j2',
  zoom: 7.1,
  center: [9.9936818, 53.5510846],
});

/**
 * Draw isolines on a map.
 *
 * An isoline object contains `polygon` data
 * The polygon has geometry data with coordinates that can be renered on map.
 * We can use the polygon_count to get the amunt of polygons availble and to lopp through all of them.
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
  console.log(data);
  while (index < data.polygon_count) {
    console.log(index);
    addLayer(data.polygons[index].geometry.coordinates, index);
    index = index + 1;
  }
};

const addLayer = (dataLayer, index) => {
  map.on('load', () => {
    console.log(dataLayer);
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
        'fill-opacity': 0.2,
      },
    });
  });
};

import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;
const plugins = [
  json(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
  }),
  resolve({
    browser: true,
  }),
  commonjs({
    namedExports: {
      '@mapbox/polyline': ['decode'],
    },
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  production && terser(),
];

export default [
  {
    input: 'examples/1.cars/1.car-list/index.js',
    output: {
      file: 'public/car-list/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/1.cars/2.car-details/index.js',
    output: {
      file: 'public/car/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/2.stations/1.station-info/index.js',
    output: {
      file: 'public/station-info/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/2.stations/2.station-list/index.js',
    output: {
      file: 'public/stations/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/3.routes/1.route/index.js',
    output: {
      file: 'public/route/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/3.routes/2.alternative-routes/index.js',
    output: {
      file: 'public/alternative-routes/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/3.routes/3.stations-along-route/index.js',
    output: {
      file: 'public/stations-along-route/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/3.routes/4.preferred-operator/index.js',
    output: {
      file: 'public/preferred-operator/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/3.routes/5.elevation-plot/index.js',
    output: {
      file: 'public/elevation-plot/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/3.routes/6.battery-capacity/index.js',
    output: {
      file: 'public/battery-capacity/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/3.routes/7.state-of-charge/index.js',
    output: {
      file: 'public/state-of-charge/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/4.tile-service/1.tile-server/index.js',
    output: {
      file: 'public/tile-server/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/4.tile-service/2.tile-json/index.js',
    output: {
      file: 'public/tile-json/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/5.isolines/1.isoline/index.js',
    output: {
      file: 'public/isolines/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
];

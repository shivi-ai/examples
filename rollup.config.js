import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

// eslint-disable-next-line no-undef
require('dotenv').config();

// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;
const plugins = [
  json(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
    // eslint-disable-next-line no-undef
    'process.env.MAPBOX_TOKEN': JSON.stringify(process.env.MAPBOX_TOKEN),
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
    input: 'route/index.js',
    output: {
      file: 'public/route/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'car/index.js',
    output: {
      file: 'public/car/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'stations/index.js',
    output: {
      file: 'public/stations/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'station-info/index.js',
    output: {
      file: 'public/station-info/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'tile-server/index.js',
    output: {
      file: 'public/tile-server/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'elevation-plot/index.js',
    output: {
      file: 'public/elevation-plot/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'stations-along-route/index.js',
    output: {
      file: 'public/stations-along-route/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'state-of-charge/index.js',
    output: {
      file: 'public/state-of-charge/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
];

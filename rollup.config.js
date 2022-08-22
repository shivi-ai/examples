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
    input: 'examples/route/index.js',
    output: {
      file: 'public/route/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/car/index.js',
    output: {
      file: 'public/car/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/car-list/index.js',
    output: {
      file: 'public/car-list/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/stations/index.js',
    output: {
      file: 'public/stations/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/station-info/index.js',
    output: {
      file: 'public/station-info/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/tile-server/index.js',
    output: {
      file: 'public/tile-server/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/elevation-plot/index.js',
    output: {
      file: 'public/elevation-plot/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/stations-along-route/index.js',
    output: {
      file: 'public/stations-along-route/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/state-of-charge/index.js',
    output: {
      file: 'public/state-of-charge/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/alternative-routes/index.js',
    output: {
      file: 'public/alternative-routes/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/battery-capacity/index.js',
    output: {
      file: 'public/battery-capacity/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/preferred-operator/index.js',
    output: {
      file: 'public/preferred-operator/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/tile-json/index.js',
    output: {
      file: 'public/tile-json/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
  {
    input: 'examples/isolines/index.js',
    output: {
      file: 'public/isolines/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins,
  },
];

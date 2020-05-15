import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import {terser} from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;
const plugins = [
  replace({
    "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development")
  }),
  resolve({
    browser: true
  }),
  commonjs({
    namedExports: {
      '@mapbox/polyline': ['decode']
    }
  }),
  babel({
    exclude: "node_modules/**"
  }),
  production && terser()
];

export default [
  {
    input: "route/index.js",
    output: {
      file: "public/route/bundle.js",
      format: "iife",
      sourcemap: true
    },
    plugins
  },
  {
    input: "car/index.js",
    output: {
      file: "public/car/bundle.js",
      format: "iife",
      sourcemap: true
    },
    plugins
  }
];

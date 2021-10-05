import path from 'path';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import packageJson from './package.json';

const pkg = `${packageJson.name}.bobplugin`;

const RollupConfig = {
  input: path.join(__dirname, './src/main.ts'),
  output: {
    format: 'cjs',
    exports: 'auto',
    file: path.join(__dirname, `./dist/${pkg}/main.js`),
    globals: {
      $util: '$util',
      $http: '$http',
      $info: '$info',
      $option: '$option',
      $log: '$log',
      $data: '$data',
      $file: '$file',
    }
  },
  plugins: [
    copy({
      targets: [
        { src: './src/info.json', dest: `dist/${pkg}/` },
        { src: './src/libs', dest: `dist/${pkg}/` },
      ],
    }),
    json({ namedExports: false }),
    resolve({
      extensions: ['.js', '.ts', '.json'],
      preferBuiltins: false,
    }),
    commonjs(),
    nodePolyfills(),
    babel({
      extensions: ['.js', '.ts'],
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    esbuild({
      // All options are optional
      include: /\.[jt]?s$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: false, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es6', // default, or 'es20XX', 'esnext',
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json',
      },
    }),
  ],
  external: ['crypto-js']
};

export default RollupConfig;
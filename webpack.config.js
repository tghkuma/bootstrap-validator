const path = require('path');

const entry = {
  'bootstrap-validator': './src'
}
const umdConfig = {
  mode: 'development',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: `[name].js`,
    libraryTarget: 'umd',
  },
  // devtool: false,
  devtool: 'source-map',
};
const umdMinConfig = {
  mode: 'production',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: `[name].min.js`,
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
};
const esmConfig = {
  mode: 'development',
  entry: entry,
  output: {
    path: __dirname + '/js',
    filename: `[name].esm.js`,
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  // devtool: false,
  devtool: 'source-map',
};
const esmMinConfig = {
  mode: 'production',
  entry: entry,
  output: {
    path: __dirname + '/js',
    filename: `[name].esm.min.js`,
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  devtool: 'source-map',
};
module.exports = [
  umdConfig,
  umdMinConfig,
  esmConfig,
  esmMinConfig
];

const path = require('path');
const entry = {
  'bootstrap-validator': [
    './src/messages/ja.js',
    './src/bootstrap-validator-valid-func.js',
    './src/bootstrap-validator-valid-exists-func.js',
    './src/bootstrap-validator.js',
  ],
};
const umdConfig = {
  mode: 'development',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: `[name].js`,
    libraryTarget: 'umd',
  },
  devtool: false,
};
const umdMinConfig = {
  mode: 'production',
  entry: entry,
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: `[name].min.js`,
    libraryTarget: 'umd',
  },
  // devtool: 'source-map',
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
  devtool: false,
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
  // devtool: 'source-map',
};
module.exports = [
  umdConfig,
  umdMinConfig,
  esmConfig,
  esmMinConfig
];

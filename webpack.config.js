var webpack = require('webpack');
var path = require('path');

var PATHS = {
  SRC: path.resolve(__dirname, '.'),
  TARGET: path.resolve(__dirname, 'dist')
};

var config = {
  entry: { 
    'vertical-filter-bundle': [
      path.resolve(PATHS.SRC, 'index.js')
    ]
  },
  output: {
    path: PATHS.TARGET,
    filename: '[name].js',
    library: 'vertical-filter-bar',
    libraryTarget: 'umd',
    sourceMapFilename: '[name].js.map'
  },
  resolve: {
    root: [path.resolve('.')]
  },
  eslint: {
    failOnWarning: false,
    failOnError: true,
    configFile: '.eslintrc'
  },
  devtool: 'source-map',
  module: {
    preLoaders: [{
      test: /\.(js|jsx)?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }],
    loaders: [
      {test: /\.(js|jsx)$/, loaders: ['babel-loader', 'eslint-loader'], exclude: /node_modules/},
      {test: /\.(png|jpg|svg)(\?.*)?$/, loader: 'url-loader?limit=16384'},
      {test: /\.(css|scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
      }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ]
};

module.exports = config;
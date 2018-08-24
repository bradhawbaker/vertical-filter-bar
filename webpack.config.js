var webpack = require('webpack');
var path = require('path');
var devPort = process.env.PORT || 8005;

var PATHS = {
  SRC: path.resolve(__dirname, '.'),
  TARGET: path.resolve(__dirname, 'dist')
};

var config = {
  entry: [path.resolve(PATHS.SRC, 'index.js')],
  output: {
    path: PATHS.TARGET,
    filename: 'bundle.js',
    library: 'vertical-filter-bar',
    libraryTarget: 'umd'
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
  devServer: {
    port: devPort,
    historyApiFallback: true,
    publicPath: `http://localhost:${devPort}/vertical-filter-bar/`,
    contentBase: PATHS.TARGET,
    hot: true,
    progress: true,
    inline: true,
    debug: true,
    stats: {
      colors: true
    }
  }
};

module.exports = config;
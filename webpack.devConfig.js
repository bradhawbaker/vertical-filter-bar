/*
 * Copyright © 2016-2017 European Support Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Created by KACHUNA on 10/21/2016.
 */
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var devPort = process.env.PORT || 8005;

var PATHS = {
  SRC: path.resolve(__dirname, '.'),
  TARGET: path.resolve(__dirname, 'dist')
};

var devConfig = {
  entry: {
    bundle: [
      './main.verticalFilterBar.jsx',
      `webpack-dev-server/client?http://localhost:${devPort}`,
      'webpack/hot/only-dev-server'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: `http://localhost:${devPort}/vertical-filter-bar/`,
    filename: '[name].js'
  },
  devServer: {
    port: devPort,
    historyApiFallback: true,
    publicPath: `http://localhost:${devPort}/vertical-filter-bar/`,
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
    progress: true,
    inline: true,
    debug: true,
    stats: {
      colors: true
    }
  },
  module: {
    preLoaders: [{
      test: /\.(js|jsx)?$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }],
    loaders: [
      {test: /\.(js|jsx)$/, loaders: ['react-hot', 'babel-loader', 'eslint-loader'], exclude: /node_modules/},
      {test: /\.(png|jpg|svg)(\?.*)?$/, loader: 'url-loader?limit=16384'},
      {test: /\.(css|scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']}
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(PATHS.SRC, 'index.html'), to: 'index.html', force: true
      }
    ]),
    new webpack.DefinePlugin({
      DEBUG: true
    }),

    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = devConfig;
// for Hot Module Replacement
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const core = require('./webpack.core.config');

// debugging circular dependencies
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = merge(core, {
  devtool: 'source-map',
  entry: {
    'vertical-filter-bar' : [
      path.join(__dirname, './dev/src', '/index.js')
    ]
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    // use HtmlWebpackPlugin to auto generate the index.html file
    // based on a template (index_template)
    new HtmlWebpackPlugin({
      title: "Vertical filter bar - Demo",
      template: './index_template.html',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      // exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    })
  ],
  devServer: {
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
    // Enable gzip compression of generated files.
    compress: true,
    // where to pull the source from
    contentBase: '/dist',
    // enable hot module replacement
    hot: true,
    // launch a browser by default on start up
    open: true
  }
});
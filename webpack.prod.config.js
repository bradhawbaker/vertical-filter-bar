const path = require('path');
const merge = require('webpack-merge');
const core = require('./webpack.core.config');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(core, {
  mode: "production",
  devtool: 'source-map',
  entry: {
    'vertical-filter-bar' : './index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path:  path.resolve(__dirname, 'dist'),
    publicPath: '/',
    library: 'verticalFilterBar',
    libraryTarget: 'umd'
  },
  externals: [
    "prop-types",
    "react",
    "react-dom"
  ],
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          "style-loader", //3. Inject styles into DOM
          "css-loader", //2. Turns css into commonjs
          "sass-loader" //1. Turns sass into css
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    minimizer: [
      new TerserJSPlugin({ sourceMap: true }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
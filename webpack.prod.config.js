const path = require('path');
const merge = require('webpack-merge');
const core = require('./webpack.core.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(core, {
  devtool: 'source-map',
  entry: {
    'vertical-filter-bar' : [
      path.join(__dirname, './index.js')
    ]
  },
  externals: [
    "prop-types",
    "react",
    "react-dom"
  ],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [

           'style-loader', 'css-loader','sass-loader'
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
  ],
  output: {
    path:  path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
    library: 'verticalFilterBar',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
});
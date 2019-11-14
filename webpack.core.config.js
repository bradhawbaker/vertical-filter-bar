// Core/base webpack config (to be combined with prod or dev config
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          },
          'eslint-loader'
        ]
      },
      {
        test: /\.(css|sass|scss)$/,
        exclude:  [ path.join(__dirname, '/external'), path.join(__dirname, '/node_modules') ],
        use: [
          'style-loader', 
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]"
              }
            }
          },
          'sass-loader'
        ]
      },      
      {
        test: /\.(css)$/,
        exclude:  [path.join(__dirname, '/resources')],
        use: [ 'style-loader', "css-loader", 'sass-loader' ]
      },      
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'dist/images'
            }
          }
        ],
        exclude: /node_modules/,
      }
    ]
  }
};
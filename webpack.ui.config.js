'use strict';

// Webpack
const webpack = require('webpack')
// Final Config
module.exports = {
  entry: './src/transport/ui/templates.js',
  output: {
    filename: 'lib/transport/ui/templates.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'url-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets:[ 'es2015', 'stage-2' ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      }
    ]
  }
}

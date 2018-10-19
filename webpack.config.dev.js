'use strict';

// Webpack
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Plugin Setup
const globalsPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  'process.env': { 'NODE_ENV': JSON.stringify('development') }
})

// Final Config
module.exports = {
  entry: './test/ui.test.js',
  output: {
    filename: './test/test-build-[hash].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'url-loader',
        query: {
          limit: 10000,
        }
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
  },
  node: {
    console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    modules: [ './src', 'node_modules' ],
    extensions: ['.js', '.json']
  },
  plugins: [
    globalsPlugin,
    new HtmlWebpackPlugin()
  ]
}

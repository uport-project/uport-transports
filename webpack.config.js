'use strict';

// Webpack
const webpack = require('webpack')

// Plugin Setup
const globalsPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  'process.env': { 'NODE_ENV': JSON.stringify('development') }
})

let libraryName = 'uport-core'

// Final Config
module.exports = {
  entry: {'uport-core': './src/index.js'},
  output: {
    filename: 'dist/[name].js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  module: {
    rules: [
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
    globalsPlugin
    // new webpack.SourceMapDevToolPlugin({
    //   filename: outputFile + '.map',
    //   append: false,
    //   module: true,
    //   columns: true,
    //   lineToLine: true
    // })

  ]
}

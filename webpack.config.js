const path = require('path'),
      webpack = require('webpack');

module.exports = {
  context: __dirname + '/js',
  entry: './crashbrowser.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'js')
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    alias: {
      jquery: "jquery/src/jquery",
    }
  },
  devtool: 'source-map'
};
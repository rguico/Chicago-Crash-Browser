var path = require("path");
var webpack = require("webpack");

module.exports = {
  context: __dirname + '/js',
  entry: './crashbrowser.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
      root: [
        path.join(__dirname, 'bower_components'),
        path.join(__dirname, 'node_modules'),
        path.join(__dirname, 'js'),
        path.join(__dirname, 'js', 'lib')
      ]
  },
  plugins: [
      new webpack.ResolverPlugin(
          new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
      ),
      new webpack.ProvidePlugin({
        jQuery: 'jquery'
      })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-map'
};
//var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        components:'./index.js'
    },
    output: {
        path: './build',
        filename: '[name].bundle.js',
        publicPath: '/build/'
    },
    module: {
        loaders: [
           {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015', 'react']
        }
    }
        ],
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
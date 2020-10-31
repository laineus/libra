'use strict'

const webpack = require('webpack')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const WriteFilePlugin = require('write-file-webpack-plugin')
const TileExtrudeWebpackPlugin = require('tile-extrude-webpack-plugin')
const PhaserAssetsWebpackPlugin = require('phaser-assets-webpack-plugin')

const assetSettings = require('./assetSettings')

module.exports = (_env, argv) => ({
  entry: {
    app: './src/index.js',
    vendor: ['phaser', 'vue']
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        include: path.resolve(__dirname, 'src/'),
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-proposal-optional-chaining'],
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }]
          ]
        }
      },
      {
        test: /\.(js|vue)$/,
        exclude: '/node_modules/',
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue']
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public')
  },
  plugins: [
    new WriteFilePlugin(),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(argv.mode),
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      '__VUE_OPTIONS_API__': JSON.stringify(false),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(false)
    }),
    new TileExtrudeWebpackPlugin({ size: 32, input: './public/img/map/tilesets', output: './public/img/map/extruded_tilesets' }),
    new PhaserAssetsWebpackPlugin(assetSettings),
    new webpack.ProvidePlugin({
      t: [path.resolve(__dirname, 'src/locales/t'), 'default']
    }),
    new VueLoaderPlugin()
  ],
  externals: {},
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial'
    }
  },
  performance: { hints: false }
})

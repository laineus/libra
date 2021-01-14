'use strict'

const webpack = require('webpack')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const AutoTileWebpackPlugin = require('auto-tile-webpack-plugin')
// const TileExtrudeWebpackPlugin = require('tile-extrude-webpack-plugin')
const PhaserAssetsWebpackPlugin = require('phaser-assets-webpack-plugin')

const assetsConfig = require('./assets.config')
// const autotileConfig = require('./autotile.config')
// const extrudeConfig = require('./extrude.config')

module.exports = (_env, argv) => ({
  entry: {
    app: './src/index.js',
    vendor: ['phaser', 'vue']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        include: path.resolve(__dirname, 'src/'),
        loader: 'babel-loader',
        options: {
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
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(argv.mode),
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      '__VUE_OPTIONS_API__': JSON.stringify(false),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(false)
    }),
    // new AutoTileWebpackPlugin(autotileConfig),
    // new TileExtrudeWebpackPlugin(extrudeConfig),
    new PhaserAssetsWebpackPlugin(assetsConfig),
    new webpack.ProvidePlugin({
      t: [path.resolve(__dirname, 'src/data/translate'), 'default']
    }),
    new VueLoaderPlugin()
  ],
  externals: {},
  performance: { hints: false }
})

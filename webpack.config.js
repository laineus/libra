'use strict'

const webpack = require('webpack')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
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
    new ESLintPlugin({ extensions: ['js', 'vue'] }),
    new HtmlWebpackPlugin({ filename: 'app.html', template: path.resolve(__dirname, 'src/app.html') }),
    new HtmlWebpackPlugin({ filename: 'fullscreen.html', template: path.resolve(__dirname, 'src/fullscreen.html') }),
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(argv.mode),
      'APP_VERSION': JSON.stringify(process.env.npm_package_version),
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      '__VUE_OPTIONS_API__': JSON.stringify(false),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(false)
    }),
    // new AutoTileWebpackPlugin(autotileConfig),
    // new TileExtrudeWebpackPlugin(extrudeConfig),
    new PhaserAssetsWebpackPlugin(assetsConfig, { documentRoot: './public', output: './src/assets.json' }),
    new webpack.ProvidePlugin({
      t: [path.resolve(__dirname, 'src/data/translate'), 'default']
    }),
    new VueLoaderPlugin()
  ],
  externals: {},
  devtool: 'eval-source-map',
  performance: { hints: false }
})

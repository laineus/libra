import 'phaser'
import { createPhavuerApp } from 'phavuer'
import registerTiledJSONExternalLoader from 'phaser-tiled-json-external-loader'
import assets from 'assets'
import extendNativeClassFunctions from '@/util/extendNativeClassFunctions'
import App from '@/components/App'
import config from '@/data/config'

registerTiledJSONExternalLoader(Phaser)
extendNativeClassFunctions(config.WIDTH, config.HEIGHT, config.TILE_SIZE)

location.query = location.search.substr(1).split('&').filter(Boolean).reduce((obj, v) => {
  const arr = v.split('=')
  obj[arr[0]] = arr[1]
  return obj
}, {})

const option = {
  type: Phaser.AUTO,
  width: config.WIDTH,
  height: config.HEIGHT,
  scene: {
    create () {
      createPhavuerApp(this.game, App)
    },
    preload () {
      Object.entries(assets).forEach(([method, list]) => {
        list.forEach(args => this.load[method](...args))
      })
    }
  },
  render: {
    roundPixels: true
  },
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { y: 0 }
    }
  },
  audio: {
    disableWebAudio: true
  },
  input: {
    activePointers: 3
  }
  // fps: { target: 30, forceSetTimeOut: true }
}

const game = new Phaser.Game(option)
window.game = game
window.addEventListener('resize', () => game.scale.refresh())

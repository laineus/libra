import 'phaser'
import { createPhavuerApp } from 'phavuer'
import '@/util/extendNativeClassFunctions'
import loadAssets from '@/util/loadAssets'
import App from '@/components/App'
import config from '@/data/config'

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
      loadAssets(this)
    }
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

import 'phaser'
import { createPhavuerApp } from 'phavuer'
import registerTiledJSONExternalLoader from 'phaser-tiled-json-external-loader'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import '@/util/extendNativeClassFunctions'
import assets from '@/assets.json'
import App from '@/components/App'
import config from '@/data/config'

Sentry.init({
  dsn: 'https://b94535c9911b4e8b95b711ef70ce5ae5@o569163.ingest.sentry.io/5714684',
  integrations: [new Integrations.BrowserTracing()],
  release: `dream-libra@${APP_VERSION}`,
  tracesSampleRate: 1.0
})

registerTiledJSONExternalLoader(Phaser)

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
  input: {
    activePointers: 3
  }
  // fps: { target: 30, forceSetTimeOut: true }
}

const game = new Phaser.Game(option)
window.addEventListener('resize', () => game.scale.refresh())

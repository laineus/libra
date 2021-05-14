import { createApp } from 'vue'
import 'phaser'
import { createPhavuerApp } from 'phavuer'
import registerTiledJSONExternalLoader from 'phaser-tiled-json-external-loader'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import '@/util/extendNativeClassFunctions'
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

const vueApp = createApp(App)

// Temporary fix: https://github.com/photonstorm/phaser/issues/5696
Phaser.Scenes.SceneManager.prototype.loadComplete = function (loader) {
  const scene = loader.scene
  if (this.game.sound && this.game.sound.onBlurPausedSounds) {
    this.game.sound.unlock()
  }
  this.create(scene)
}

const ua = navigator.userAgent
const isTouchDevice = window.ontouchstart !== undefined && navigator.maxTouchPoints > 0
const isAppleDevice = ua.indexOf('Macintosh') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1
const iOS = isTouchDevice && isAppleDevice // iPhone or iPad

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: config.WIDTH,
  height: config.HEIGHT,
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
    disableWebAudio: iOS
  },
  input: {
    activePointers: 3
  },
  callbacks: {
    postBoot () {
      window.addEventListener('resize', () => game.scale.refresh())
      createPhavuerApp(game, vueApp)
    }
  }
  // fps: { target: 30, forceSetTimeOut: true }
})

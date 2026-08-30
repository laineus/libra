import * as Phaser from 'phaser'
import registerTiledJSONExternalLoader from 'phaser-tiled-json-external-loader'
import * as Sentry from '@sentry/browser'
import './util/extendNativeClassFunctions.js'
import { createApp } from 'vue'
import App from './App.vue'
import packageJson from '../package.json'

Sentry.init({
  dsn: 'https://b94535c9911b4e8b95b711ef70ce5ae5@o569163.ingest.sentry.io/5714684',
  integrations: [Sentry.browserTracingIntegration()],
  release: `dream-libra@${packageJson.version}`,
  tracesSampleRate: 1.0
})

registerTiledJSONExternalLoader(Phaser)

createApp(App).mount('#game')

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import inject from '@rollup/plugin-inject'
import phaserAssetsRollupPlugin from 'phaser-assets-loader/plugins/rollupPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    inject({
      t: [fileURLToPath(new URL('./src/data/translate', import.meta.url)), 'default']
    }),
    phaserAssetsRollupPlugin({
      patterns: [
        { type: 'image', prefix: '', dir: './img/sprites', rule: /^\w+\.png$/ },
        { type: 'image', prefix: 'item/', dir: './img/items', rule: /^\w+\.png$/ },
        { type: 'image', prefix: 'chara_sprite/', dir: './img/chara_sprites', rule: /^\w+\.png$/ },
        { type: 'image', prefix: 'tileset/', dir: './img/map/tilesets', rule: /^\w+\.png$/ },
        { type: 'image', prefix: 'tileset/', dir: './img/map/images', rule: /^\w+\.png$/ },
        { type: 'tilemapTiledJSONExternal', prefix: '', dir: './map', rule: /^\w+\.json$/ },
        { type: 'audio', prefix: 'se/', dir: './audio/se', rule: /^\w+\.wav$/ },
        { type: 'audio', prefix: 'bgm/', dir: './audio/bgm', rule: /^\w+\.(m4a|ogg)$/ }
      ],
      spriteSheetSettingsFileName: 'settings.json',
      documentRoot: './public',
      output: './src/assets.json'
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        app: 'app.html'
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

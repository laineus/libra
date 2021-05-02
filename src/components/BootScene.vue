<template>
  <Scene name="BootScene" :autoStart="true" @preload="preload">
    <Container :x="config.WIDTH.half" :y="config.HEIGHT.half">
      <Text :text="`Loading ${Math.round(progress * 100)}%`" :origin="0.5" :y="-14" color="white" :size="13" />
      <Rectangle :width="200" :height="2" :fillColor="0x555555" :originY="0" />
      <Rectangle :width="200" :height="2" :fillColor="config.COLORS.orange" :originX="0" :originY="0" :x="-100" :scaleX="progress" />
    </Container>
  </Scene>
</template>

<script>
import { ref } from 'vue'
import { Scene, Rectangle, Container } from 'phavuer'
import assets from '@/assets.json'
import config from '@/data/config'
import Text from '@/components/Text'
assets.audio.filter(v => Array.isArray(v[1])).forEach(v => v[1].reverse()) // [m4a, ogg] -> [ogg, m4a]
if (window.ASSET_PATH) assets.tilemapTiledJSONExternal.forEach(v => v.push('/')) // bugfix
export default {
  components: { Scene, Rectangle, Container, Text },
  setup () {
    const progress = ref(0)
    const preload = scene => {
      scene.load.on('progress', function (value) {
        // console.log(value)
        progress.value = Math.max(value, progress.value)
      })
      scene.load.on('complete', function () {
        // console.log('complete')
      })
      if (window.ASSET_HOST) scene.load.setBaseURL(window.ASSET_HOST)
      if (window.ASSET_PATH) scene.load.setPath(window.ASSET_PATH)
      Object.entries(assets).forEach(([method, list]) => {
        list.forEach(args => scene.load[method](...args))
      })
    }
    return {
      preload,
      config,
      progress
    }
  }
}
</script>

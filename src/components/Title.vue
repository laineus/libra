<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" />
  <Image texture="main" :x="config.WIDTH.half" :y="config.HEIGHT.half" />
  <Image texture="logo" :x="config.WIDTH.half" :y="config.HEIGHT.half - 80" />
  <Text :text="`${v.name} ${v.state?.map ?? 'empty'}`" color="white" v-for="(v, i) in list" :key="v.number" :x="40" :y="40 + (i * 30)" @pointerdown="load(v)" />
  <Container v-for="(v, i) in list" :key="i" :x="config.WIDTH.half" :y="380 + (i * 40)">
    <Image texture="nav" :frame="i" @pointerdown="tapItem(i)" />
    <Text :text="v" :origin="0.5" />
  </Container>
</template>

<script>
import { inject } from 'vue'
import { Rectangle, Image, Container } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
export default {
  components: { Rectangle, Text, Image, Container },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    const storage = inject('storage')
    const list = ['はじめから', 'つづきから', '設定']
    return {
      config,
      list,
      tapItem: async i => {
        if (i === 0) {
          // await gameScene.value.setField('forest1', 300, 552, -Math.PI.half)
          await gameScene.value.setField('forest3', 800, 452, -Math.PI.half)
          context.emit('close')
        }
      },
      load: async data => {
        if (!data.state) return
        await storage.load(data.number)
        await gameScene.value.setField(storage.state.map, storage.state.x, storage.state.y, -Math.PI.half)
        context.emit('close')
      }
    }
  }
}
</script>

<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="selected = null" />
  <Image texture="main" :x="config.WIDTH.half" :y="config.HEIGHT.half" />
  <Image texture="logo" :x="config.WIDTH.half" :y="config.HEIGHT.half - 80" />
  <Text :text="`${v.name} ${v.state?.map ?? 'empty'}`" color="white" v-for="(v, i) in list" :key="v.number" :x="40" :y="40 + (i * 30)" @pointerdown="load(v)" />
  <Container v-for="(v, i) in list" :key="i" :x="config.WIDTH.half" :y="380 + (i * 40)" :visible="!selected">
    <Image texture="nav" :frame="i" @pointerdown.stop="tapItem(i)" />
    <Text :text="v" :origin="0.5" />
  </Container>
  <Container v-if="selected" :x="config.WIDTH.half" :y="400">
    <RoundRectangle :width="266" :height="206" :origin="0.5" :radius="5" :fillColor="config.COLORS.soy" @pointerdown.stop />
    <RoundRectangle :width="261" :height="201" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" />
    <menu-system-config v-if="selected === 2" :x="-110" :y="-94" />
    <RoundRectangle :width="101" :height="23" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" :y="72" @pointerdown="selected = null" />
    <Text text="OK" :origin="0.5" :y="72" :size="14" />
  </Container>
</template>

<script>
import { inject, ref } from 'vue'
import { Rectangle, Image, Container, RoundRectangle } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
import MenuSystemConfig from '@/components/MenuSystemConfig'
export default {
  components: { Rectangle, Text, Image, Container, RoundRectangle, MenuSystemConfig },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    const storage = inject('storage')
    const selected = ref(null)
    const list = ['はじめから', 'つづきから', '設定']
    return {
      config,
      selected,
      list,
      tapItem: async i => {
        if (i === 0) {
          // await gameScene.value.setField('forest1', 300, 552, -Math.PI.half)
          await gameScene.value.setField('forest3', 800, 452, -Math.PI.half)
          context.emit('close')
        } else {
          selected.value = i
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

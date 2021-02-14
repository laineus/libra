<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" />
  <Image texture="main" :x="config.WIDTH.half" :y="config.HEIGHT.half" />
  <Image texture="logo" :x="config.WIDTH.half" :y="config.HEIGHT.half - 80" />
  <Container v-for="(v, i) in list" :key="i" :x="config.WIDTH.half" :y="380 + (i * 40)">
    <Image texture="nav" :frame="i" @pointerdown.stop="tapItem(i)" />
    <Text :text="v" :origin="0.5" />
  </Container>
  <Container v-if="selected" :tween="tween">
    <Rectangle :fillColor="config.COLORS.black" :origin="0" :alpha="0.3" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="select(null)" />
    <Container v-if="selected === 1" :x="config.WIDTH.half" :y="375">
      <RoundRectangle :width="266" :height="276" :origin="0.5" :radius="5" :fillColor="config.COLORS.soy" @pointerdown.stop />
      <RoundRectangle :width="261" :height="271" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" />
      <menu-system-save v-if="selected === 1" :x="-110" :y="-130" :load="true" @load="$emit('close')" />
    </Container>
    <Container v-else-if="selected === 2" :x="config.WIDTH.half" :y="400">
      <RoundRectangle :width="266" :height="206" :origin="0.5" :radius="5" :fillColor="config.COLORS.soy" @pointerdown.stop />
      <RoundRectangle :width="261" :height="201" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" />
      <menu-system-config :x="-110" :y="-94" />
      <RoundRectangle :width="101" :height="23" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" :y="72" @pointerdown="select(null)" />
      <Text text="OK" :origin="0.5" :y="72" :size="14" />
    </Container>
  </Container>
</template>

<script>
import { inject, ref } from 'vue'
import { Rectangle, Image, Container, RoundRectangle } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
import MenuSystemSave from '@/components/MenuSystemSave'
import MenuSystemConfig from '@/components/MenuSystemConfig'
export default {
  components: { Rectangle, Text, Image, Container, RoundRectangle, MenuSystemSave, MenuSystemConfig },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    const selected = ref(null)
    const list = ['はじめから', 'つづきから', '設定']
    const tween = ref(null)
    const select = i => {
      if (i === null) {
        tween.value = { alpha: { from: 1, to: 0 }, duration: 70, onComplete: () => selected.value = null }
      } else {
        selected.value = i
        tween.value = { alpha: { from: 0, to: 1 }, duration: 70 }
      }
    }
    const tapItem = async i => {
      if (i === 0) {
        // await gameScene.value.setField('forest1', 300, 552, -Math.PI.half)
        await gameScene.value.setField('forest3', 800, 452, -Math.PI.half)
        context.emit('close')
      } else {
        select(i)
      }
    }
    return {
      config,
      selected,
      tween,
      list,
      tapItem, select
    }
  }
}
</script>

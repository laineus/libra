<template>
  <Image texture="main" :x="config.WIDTH.half" :y="config.HEIGHT.half" />
  <Image v-if="setting.state.lang === 'ja'" texture="logo_ja" :x="config.WIDTH.half" :y="config.HEIGHT.half - 77" />
  <Image v-else texture="logo_en" :x="config.WIDTH.half" :y="config.HEIGHT.half - 90" />
  <Container v-for="(v, i) in list" :key="i" :x="config.WIDTH.half" :y="380 + (i * 40)">
    <Image texture="nav" :frame="i" :y="3" :tint="config.COLORS.brown" :alpha="0.3" />
    <Image texture="nav" :frame="i" :blendMode="Phaser.BlendModes[selected === i ? 'ADD' : 'NORMAL']" @pointerdown.stop="select(i)" />
    <Text :text="v" :origin="0.5" :style="{ shadow: { offsetX: 0, offsetY: 1, blur: 1, color: '#00000050', fill: true } }" />
  </Container>
  <Container v-if="selected > 0" :tween="tween">
    <Rectangle :fillColor="config.COLORS.black" :origin="0" :alpha="0.3" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="select(null)" />
    <Container v-if="selected === 1" :x="config.WIDTH.half" :y="355">
      <RoundRectangle :width="266" :height="276" :origin="0.5" :radius="5" :fillColor="config.COLORS.soy" @pointerdown.stop />
      <RoundRectangle :width="261" :height="271" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" />
      <menu-system-save v-if="selected === 1" :x="-110" :y="-130" :load="true" @load="$emit('close')" />
    </Container>
    <Container v-else-if="selected === 2" :x="config.WIDTH.half" :y="390">
      <RoundRectangle :width="266" :height="206" :origin="0.5" :radius="5" :fillColor="config.COLORS.soy" @pointerdown.stop />
      <RoundRectangle :width="261" :height="201" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" />
      <menu-system-config :x="-110" :y="-94" />
      <RoundRectangle :width="101" :height="23" :origin="0.5" :radius="5" :strokeColor="config.COLORS.brown" :lineWidth="1" :y="72" @pointerdown="select(null)" />
      <Text :text="t('ui.ok')" :origin="0.5" :y="72" :size="14" />
    </Container>
  </Container>
  <template v-if="!creditEnd">
    <Rectangle :fillColor="0x111111" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :tween="bgTween" @pointerdown.stop="creditEnd = true" />
    <Image texture="logo_laineus" :x="config.WIDTH.half" :y="config.HEIGHT.half" :tween="logoTween" />
  </template>
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
    const setting = inject('setting')
    const audio = inject('audio')
    const selected = ref(null)
    const list = [t('ui.newGame'), t('ui.continue'), t('ui.config')]
    const tween = ref(null)
    const select = async i => {
      if (i === null) {
        tween.value = { alpha: { from: 1, to: 0 }, duration: 70, onComplete: () => selected.value = null }
      } else if (i === 0) {
        selected.value = 0
        // await gameScene.value.setField('forest1', 300, 552, -Math.PI.half)
        await gameScene.value.setField('hospital2', 1072, 484, -Math.PI.half, { autosave: false })
        context.emit('close')
      } else {
        selected.value = i
        tween.value = { alpha: { from: 0, to: 1 }, duration: 70 }
      }
    }
    const creditEnd = ref(false)
    const bgTween = ref(null)
    const logoTween = {
      duration: 250,
      hold: 1600,
      alpha: { from: 0, to: 1 },
      yoyo: true,
      onComplete: () => {
        audio.setBgm('happy')
        bgTween.value = {
          delay: 300,
          duration: 1000,
          alpha: 0,
          onComplete: () => {
            creditEnd.value = true
          }
        }
      }
    }
    return {
      t,
      Phaser,
      config,
      setting,
      selected,
      tween,
      list,
      select,
      creditEnd,
      bgTween,
      logoTween
    }
  }
}
</script>

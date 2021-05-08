<template>
  <Image texture="main" :x="config.WIDTH.half" :y="config.HEIGHT.half" />
  <Text :text="`Version: ${APP_VERSION}`" :size="11" color="soy" :origin="1" :x="config.WIDTH - 80" :y="config.HEIGHT - 35" />
  <Container>
    <Image v-if="setting.state.lang === 'ja'" texture="logo_ja" :x="config.WIDTH.half" :y="config.HEIGHT.half - 77" />
    <Image v-else texture="logo_en" :x="config.WIDTH.half" :y="config.HEIGHT.half - 90" />
  </Container>
  <Container v-for="(v, i) in list" :key="i" :x="config.WIDTH.half" :y="380 + (i * 40)">
    <Image texture="nav" :frame="i" :blendMode="Phaser.BlendModes.OVERLAY" :alpha="selected === i ? 1 : 0.87" @pointerdown.stop="select(i)" />
    <Text :text="t(`ui.${v}`).split('').join(' ')" :size="13" :origin="0.5" :bold="true" :style="{ shadow: { offsetX: 0, offsetY: 1, blur: 1, color: '#00000020', fill: true } }" />
  </Container>
  <Container v-if="selected > 0" :tween="tween">
    <Rectangle :fillColor="config.COLORS.black" :origin="0" :alpha="0.5" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="select(null)" />
    <OrganicWindow v-if="selected === 1" :x="config.WIDTH.half" :y="340" :width="250" :height="275" @pointerdown.stop>
      <menu-system-save v-if="selected === 1" :x="-120" :y="-128" :load="true" @load="$emit('close')" />
    </OrganicWindow>
    <OrganicWindow v-else-if="selected === 2" :x="config.WIDTH.half" :y="375" :width="250" :height="210" @pointerdown.stop>
      <menu-system-config :x="-120" :y="-98" :backToTitle="false" />
      <RoundRectangle :width="101" :height="23" :origin="0.5" :radius="7" :strokeColor="config.COLORS.brown" :lineWidth="1" :y="82" @pointerdown="select(null)" />
      <Text :text="t('ui.ok')" :origin="0.5" :y="82" :size="14" />
    </OrganicWindow>
  </Container>
  <template v-if="!creditEnd">
    <Rectangle :fillColor="0x111111" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :tween="bgTween" @pointerdown.stop="skipCredit" />
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
import OrganicWindow from '@/components/OrganicWindow'
export default {
  components: { Rectangle, Text, Image, Container, RoundRectangle, MenuSystemSave, MenuSystemConfig, OrganicWindow },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    const setting = inject('setting')
    const audio = inject('audio')
    const selected = ref(null)
    const list = ['newGame', 'continue', 'config']
    const tween = ref(null)
    const select = async i => {
      if (i === null) {
        audio.se('cancel')
        tween.value = { alpha: { from: 1, to: 0 }, duration: 70, onComplete: () => selected.value = null }
      } else if (i === 0) {
        audio.se('click')
        selected.value = 0
        await gameScene.value.setField('forest2', (12).toPixelCenter, (23).toPixelCenter, -Math.PI.half, { autosave: false })
        context.emit('close')
      } else {
        audio.se('click')
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
    audio.setBgm(null)
    const skipCredit = () => {
      audio.setBgm('happy')
      creditEnd.value = true
    }
    return {
      APP_VERSION: APP_VERSION,
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
      logoTween,
      skipCredit
    }
  }
}
</script>

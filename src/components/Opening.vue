<template>
  <Container>
    <template v-if="step === 0">
      <Rectangle :fillColor="config.COLORS.black" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :tweens="bgTweens" />
      <Image v-if="setting.state.lang === 'ja'" texture="logo_ja" :x="config.WIDTH.half" :y="config.HEIGHT.half - 7" :tweens="logoTweens" :alpha="0" />
      <Image v-else-if="setting.state.lang === 'cn'" texture="logo_cn" :x="config.WIDTH.half" :y="config.HEIGHT.half - 7" :tweens="logoTweens" :alpha="0" />
      <Image v-else-if="setting.state.lang === 'es'" texture="logo_es" :x="config.WIDTH.half" :y="config.HEIGHT.half - 10" :tweens="logoTweens" :alpha="0" />
      <Image v-else texture="logo_en" :x="config.WIDTH.half" :y="config.HEIGHT.half - 20" :tweens="logoTweens" :alpha="0" />
    </template>
    <Container v-else-if="step === 1" :x="180" :y="config.HEIGHT.half - 60" :tweens="creditTweens">
      <Text text="Written by" color="white" :y="-13" :size="12" />
      <Text text="Laineus" color="white" :y="13" :size="18" />
    </Container>
    <Container v-else-if="step === 2" :x="(180).byRight" :y="config.HEIGHT.half + 60" :tweens="creditTweens">
      <Text text="Graphics and Music by" color="white" :y="-13" :size="12" />
      <Text text="Laineus" color="white" :y="13" :size="18" />
    </Container>
  </Container>
</template>

<script>
import { inject, ref } from 'vue'
import config from '@/data/config'
import { Container, Rectangle, Image } from 'phavuer'
import Text from '@/components/Text'
export default {
  components: { Container, Rectangle, Image, Text },
  emits: ['unlock', 'completed'],
  setup (_, context) {
    const setting = inject('setting')
    const step = ref(0)
    const next = () => {
      step.value++
      if (step.value === 1) context.emit('unlock')
      if (step.value === 3) context.emit('completed')
    }
    const tweens = {
      bgTweens: [
        { alpha: { from: 0, to: 1 }, duration: 2000, hold: 6000 },
        { alpha: { from: 1, to: 0 }, duration: 2000 }
      ],
      logoTweens: [
        { alpha: { from: 0, to: 1 }, y: '-=15', duration: 2000, hold: 3000, delay: 3000 },
        { alpha: { from: 1, to: 0 }, y: '-=15', duration: 2000, onComplete: next }
      ],
      creditTweens: [
        { alpha: { from: 0, to: 1 }, duration: 1000, hold: 2000 },
        { alpha: { from: 1, to: 0 }, duration: 1000, onComplete: next }
      ]
    }
    return {
      config,
      setting,
      step,
      ...tweens
    }
  }
}
</script>

<template>
  <Container ref="object">
    <Rectangle :origin="0" :x="left" :y="top" :width="width" :height="height" :fillColor="fillColor" @pointerdown="pointerdown" @pointerup="pointerup" /><!-- Stroke -->
    <Rectangle :origin="0" :x="left + outline" :y="top + outline" :width="innerWidth" :height="innerHeight" :fillColor="bgColor" /><!-- BG -->
    <Rectangle :origin="0" :x="left + outline" :y="top + outline" :width="innerWidth" :height="innerHeight" :fillColor="fillColor" :scaleX="value / max" /><!-- Value -->
  </Container>
</template>

<script>
import { Container, Rectangle, refObj } from 'phavuer'
import { computed } from 'vue'
import config from '@/data/config'
export default {
  components: { Container, Rectangle },
  props: {
    origin: { default: 0 },
    originX: { default: undefined },
    originY: { default: undefined },
    width: { default: 100 },
    height: { default: 10 },
    max: { default: 1 },
    value: { default: 1 },
    outline: { default: 1 },
    fillColor: { default: config.COLORS.brown },
    bgColor: { default: config.COLORS.black }
  },
  emits: ['pointerdown', 'pointerup'],
  setup (props, context) {
    const innerWidth = computed(() => props.width - props.outline.twice)
    const innerHeight = computed(() => props.height - props.outline.twice)
    const originX = computed(() => typeof props.originX === 'number' ? props.originX : props.origin)
    const originY = computed(() => typeof props.originY === 'number' ? props.originY : props.origin)
    const left = computed(() => props.width * -originX.value)
    const top = computed(() => props.height * -originY.value)
    return {
      object: refObj(null),
      innerWidth, innerHeight,
      left, top,
      pointerdown: (...args) => context.emit('pointerdown', ...args),
      pointerup: (...args) => context.emit('pointerup', ...args)
    }
  }
}
</script>

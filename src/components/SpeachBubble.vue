<template>
  <Container>
    <RoundRectangle :y="-arrowHeight" :width="width + padding.twice.twice" :height="height + padding.twice.twice" :fillColor="COLORS.soy" :radius="radius" :originX="0.5" :originY="1" />
    <RoundRectangle :x="0" :y="-(arrowHeight + padding)" :width="width + padding.twice" :height="height + padding.twice" :lineWidth="1" :strokeColor="COLORS.brown" :radius="radius" :originX="0.5" :originY="1" />
    <Rectangle :x="0" :y="-arrowHeight" :width="12" :height="12" :fillColor="COLORS.soy" :rotation="Math.PI / 4" />
    <Rectangle :x="0" :y="-arrowHeight - 2.5" :width="12" :height="12" :fillColor="COLORS.soy" :rotation="Math.PI / 4" :lineWidth="1" :strokeColor="COLORS.brown" :origin="0.5" />
    <Rectangle :x="0" :y="-arrowHeight - 7" :width="17" :height="10" :fillColor="COLORS.soy" />
    <Container :x="-width.half" :y="-(height + arrowHeight + padding.twice)">
      <slot />
    </Container>
  </Container>
</template>

<script>
import { Container, Rectangle, RoundRectangle } from 'phavuer'
import config from '@/data/config'
export default {
  components: { Container, Rectangle, RoundRectangle },
  props: ['width', 'height', 'title'],
  setup (props) {
    const arrowHeight = 8
    const padding = 2
    const radius = 5
    const bottom = 85
    return {
      COLORS: config.COLORS,
      arrowHeight,
      padding,
      radius,
      bottom
    }
  }
}
</script>

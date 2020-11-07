<template>
  <Container>
    <RoundRectangle :y="-arrowHeight" :width="width + padding.twice.twice" :height="height + padding.twice.twice" :fillColor="0xBBAA88" :radius="radius" :originX="0.5" :originY="1" />
    <RoundRectangle :x="0" :y="-(arrowHeight + padding)" :width="width + padding.twice" :height="height + padding.twice" :lineWidth="1" :strokeColor="0x553311" :radius="radius" :originX="0.5" :originY="1" />
    <Rectangle :x="0" :y="-arrowHeight" :width="12" :height="12" :fillColor="0xBBAA88" :rotation="Math.PI / 4" />
    <Rectangle :x="0" :y="-arrowHeight - 2.5" :width="12" :height="12" :fillColor="0xBBAA88" :rotation="Math.PI / 4" :lineWidth="1" :strokeColor="0x553311" :origin="0.5" />
    <Rectangle :x="0" :y="-arrowHeight - 7" :width="17" :height="10" :fillColor="0xBBAA88" />
    <Container :x="-width.half" :y="-(height + arrowHeight + padding.twice)">
      <slot />
    </Container>
  </Container>
</template>

<script>
import { Container, Rectangle, RoundRectangle } from 'phavuer'
export default {
  components: { Container, Rectangle, RoundRectangle },
  props: ['width', 'height', 'title'],
  setup (props) {
    const arrowHeight = 8
    const padding = 2
    const radius = 5
    const bottom = 85
    return {
      arrowHeight,
      padding,
      radius,
      bottom
    }
  }
}
</script>

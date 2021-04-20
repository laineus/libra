<template>
  <Container :width="width" :height="height">
    <Image texture="window_rim" :tint="fillColor" :originX="0.5" :originY="1" :y="-rectHeight.half + 1" :scale="scale" />
    <Rectangle :width="width" :height="rectHeight" :fillColor="fillColor" />
    <Image texture="window_rim" :tint="fillColor" :originX="0.5" :originY="1" :y="rectHeight.half - 1" :scale="scale" :rotation="Math.PI" />
  </Container>
</template>

<script>
import { Container, Image, Rectangle } from 'phavuer'
import { computed } from 'vue'
const rimWidth = 240
const rimHeight = 29
export default {
  components: { Container, Image, Rectangle },
  props: ['width', 'height', 'fillColor'],
  setup (props) {
    const scale = computed(() => props.width / rimWidth)
    const rectHeight = computed(() => props.height - (rimHeight * scale.value))
    return {
      scale,
      rectHeight
    }
  }
}
</script>

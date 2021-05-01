<template>
  <Container>
    <OrganicRectangle :x="-1" :y="-height.half + 1" :fillColor="COLORS.brown" :width="width" :height="height" :rotation="Math.PI * -0.03" />
    <OrganicRectangle :y="-height.half" :fillColor="COLORS.soy" :width="width" :height="height" />
    <Image texture="menu_arrow" :y="-2 + (height * 0.022) + (width * 0.044)" :scale="0.7" :tint="COLORS.soy" />
    <Container :x="-width.half" :y="-height">
      <slot />
    </Container>
  </Container>
</template>

<script>
import { Container, Image } from 'phavuer'
import OrganicRectangle from '@/components/OrganicRectangle'
import config from '@/data/config'
export default {
  components: { Container, OrganicRectangle, Image },
  props: ['width', 'height'],
  setup () {
    return {
      COLORS: config.COLORS
    }
  }
}
</script>

<template>
  <Container>
    <Image texture="speach" :y="(-(height + 30)).half" :scaleX="(width + 40) / 162" :scaleY="(height + 35) / 84" />
    <Image texture="menu_arrow" :y="-10 - (height * 0.15)" />
    <Container :x="-width.half" :y="-(height + 17)">
      <slot />
    </Container>
  </Container>
</template>

<script>
import { Container, Image } from 'phavuer'
import config from '@/data/config'
export default {
  components: { Container, Image },
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

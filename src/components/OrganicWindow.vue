<template>
  <Container :width="width" :height="height">
    <OrganicRectangle :fillColor="config.COLORS.brown" :width="width" :height="height" :rotation="Math.PI * -0.03" :y="4" />
    <OrganicRectangle :fillColor="config.COLORS.soy" :width="width" :height="height" />
    <slot />
  </Container>
</template>

<script>
import { Container } from 'phavuer'
import OrganicRectangle from '@/components/OrganicRectangle'
import config from '@/data/config'
export default {
  components: { Container, OrganicRectangle },
  props: ['width', 'height'],
  setup () {
    return {
      config
    }
  }
}
</script>

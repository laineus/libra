<template>
  <Container>
    <RoundRectangle :width="5" :height="height" :radius="3" :fillColor="COLORS.brown" :originX="1" :originY="0" :alpha="0.3" />
    <RoundRectangle :y="scrollLength * modelValue" :width="5" :height="height * (limit / length)" :radius="3" :fillColor="COLORS.brown" :originX="1" :originY="0" />
  </Container>
</template>

<script>
import { computed } from 'vue'
import { Container, RoundRectangle } from 'phavuer'
import config from '@/data/config'
export default {
  components: { Container, RoundRectangle },
  props: {
    modelValue: { default: 0 },
    height: { default: 0 },
    length: { default: 0 },
    limit: { default: 0 }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const scrollLength = computed(() => props.height / props.length)
    const add = v => {
      context.emit('update:modelValue', Math.fix(props.modelValue + v, 0, props.length - props.limit))
    }
    let scrollY = 0
    const swipe = pointer => {
      if (!pointer.isDown) return
      scrollY += pointer.position.y - pointer.prevPosition.y
      if (Math.abs(scrollY) < scrollLength.value) return
      add(-Math.sign(scrollY))
      scrollY = 0
    }
    return {
      COLORS: config.COLORS,
      scrollLength,
      add, swipe
    }
  }
}
</script>

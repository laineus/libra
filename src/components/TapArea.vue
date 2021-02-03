<template>
  <Container ref="tapArea" :depth="100000" @pointerdown="onTap">
    <Image texture="speach_bubbles" :y="-20" :frame="frame" :tween="{ y: -24, yoyo: true, repeat: -1, duration: 500 }" />
  </Container>
</template>

<script>
import { refObj, Container, Image, onPreUpdate } from 'phavuer'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    frame: { default: 0 }
  },
  emits: ['tap'],
  setup (props, context) {
    const tapArea = refObj(null)
    const onTap = e => {
      if (e.button !== 0) return
      context.emit('tap')
    }
    onPreUpdate(() => {
      if (props.follow) tapArea.value.setPosition(props.follow.x, props.follow.y - tapArea.value.height.half + 10)
    })
    return {
      tapArea,
      onTap
    }
  }
}
</script>

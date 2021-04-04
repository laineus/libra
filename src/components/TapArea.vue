<template>
  <Container ref="tapArea" :depth="100000" @pointerdown="onTap">
    <Image texture="speach_bubbles" :y="-20" :frame="frame" :tween="{ y: -24, yoyo: true, repeat: -1, duration: 500 }" />
  </Container>
</template>

<script>
import { inject, onMounted } from 'vue'
import { refObj, Container, Image, onPreUpdate } from 'phavuer'
import tappedNearest from '@/components/modules/tappedNearest'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    frame: { default: 0 }
  },
  emits: ['tap'],
  setup (props, context) {
    const scene = inject('scene')
    const tapArea = refObj(null)
    const onTap = pointer => {
      if (pointer.button !== 0) return
      if (!tappedNearest(scene.input._temp, pointer, tapArea.value)) return
      context.emit('tap')
    }
    onMounted(() => {
      tapArea.value.tapDistance = 25
    })
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

<template>
  <Container :depth="config.DEPTH.TRANSITION" :tween="data.tween">
    <Rectangle :fillColor="config.COLORS.black" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :alpha="0.6" @pointerdown.stop="tap" />
    <Text :text="text" :x="config.WIDTH.half" :y="config.HEIGHT.half" :size="14" color="white" :origin="0.5" :style="{ align: 'center' }" :lineSpacing="5" />
  </Container>
</template>

<script>
import { computed, inject, reactive } from 'vue'
import { Rectangle, Container } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
export default {
  components: { Rectangle, Container, Text },
  props: ['name'],
  emits: ['close'],
  setup (props, context) {
    const event = inject('event')
    const data = reactive({
      resolve: null,
      skipAllowed: false,
      tween: { alpha: { from: 0, to: 1 }, duration: 150 }
    })
    event.exec(() => {
      return new Promise(resolve => {
        data.resolve = resolve
      })
    }, { closeMenu: false })
    const tap = () => {
      if (!data.skipAllowed) return
      data.resolve()
      data.tween = { alpha: { from: 1, to: 0 }, duration: 150, onComplete: () => context.emit('close') }
    }
    sleep(2000).then(() => {
      data.skipAllowed = true
    })
    const text = computed(() => t(`tutorial.${props.name}`))
    return {
      config,
      tap,
      data,
      text
    }
  }
}
</script>

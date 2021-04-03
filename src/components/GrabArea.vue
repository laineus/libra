<template>
  <Container ref="container" :depth="100000" :x="data.x" :y="data.y" @pointerdown="grab">
    <Image texture="hand_catch" :x="10" :alpha="data.grabbing ? 1 : 0.5" :tint="data.grabbing ? 0xFF0000 : config.COLORS.white" :tween="data.grabbing ? null : handTween" />
  </Container>
</template>

<script>
import { Container, Image, onPreUpdate, refObj } from 'phavuer'
import { inject, reactive, shallowReactive } from 'vue'
import config from '@/data/config'
import tappedNearest from '@/components/modules/tappedNearest'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    name: { default: null },
    scale: { default: null }
  },
  emits: ['grab', 'capture', 'cancel'],
  setup (props, context) {
    const scene = inject('scene')
    const menu = inject('menu')
    const container = refObj(null)
    const data = shallowReactive({
      x: 0, y: 0, grabbing: false
    })
    const handTween = reactive({ x: 13, y: 3, yoyo: true, repeat: -1, duration: 700, onStop: v => v.seek(0) })
    const grab = (pointer) => {
      if (pointer.button !== 0) return
      if (!tappedNearest(scene.input._temp, pointer, container.value)) return
      menu.value.select('bag').then(menuBag => {
        data.grabbing = true
        context.emit('grab')
        const mode = 'capture'
        // const mode = 'move'
        menuBag.grabItem({ key: props.name, scale: props.scale }, mode).then(pos => {
          data.grabbing = false
          context.emit(pos ? mode : 'cancel')
        })
      })
    }
    onPreUpdate(() => {
      if (props.follow) {
        data.x = props.follow.x
        data.y = props.follow.y
      }
    })
    return {
      container,
      config,
      data,
      handTween,
      grab
    }
  }
}
</script>

<template>
  <Container :depth="100000" :x="data.x" :y="data.y" @pointerdown="grab" @preUpdate="update">
    <Image texture="hand_catch" :x="10" :alpha="data.grabbing ? 1 : 0.5" :tint="data.grabbing ? 0xFF0000 : config.COLORS.white" :tween="data.grabbing ? null : handTween" />
  </Container>
</template>

<script>
import { Container, Image } from 'phavuer'
import { inject, reactive, shallowReactive } from 'vue'
import config from '@/data/config'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    name: { default: null }
  },
  emits: ['grab', 'capture', 'cancel'],
  setup (props, context) {
    const menu = inject('menu')
    const data = shallowReactive({
      x: 0, y: 0, grabbing: false
    })
    const handTween = reactive({ x: 13, y: 3, yoyo: true, repeat: -1, duration: 700 })
    const grab = () => {
      menu.value.select('bag').then(menuBag => {
        data.grabbing = true
        context.emit('grab')
        menuBag.grabItem({ key: props.name }, 'capture').then(bool => {
          data.grabbing = false
          context.emit(bool ? 'capture' : 'cancel')
        })
      })
    }
    const update = () => {
      if (props.follow) {
        data.x = props.follow.x
        data.y = props.follow.y
      }
    }
    return {
      config,
      data,
      handTween,
      grab, update
    }
  }
}
</script>

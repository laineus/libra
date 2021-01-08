<template>
  <Container :depth="100000" :x="data.x" :y="data.y" @pointerdown="grab" @preUpdate="update">
    <Image texture="hand_catch" :x="10" :alpha="data.alpha" :tint="data.tint" @create="createHand" />
  </Container>
</template>

<script>
import { Container, Image } from 'phavuer'
import { inject, reactive } from 'vue'
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
    const scene = inject('scene')
    const data = reactive({
      x: 0, y: 0, tint: config.COLORS.white, alpha: 0.5
    })
    const grab = () => {
      menu.value.select('bag').then(menuBag => {
        data.tint = 0xFF0000
        data.alpha = 1
        context.emit('grab')
        menuBag.grabItem({ key: props.name }, 'capture').then(bool => {
          data.tint = config.COLORS.white
          data.alpha = 0.5
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
    const createHand = obj => {
      scene.add.tween({ targets: obj, x: 13, y: 3, yoyo: true, repeat: -1, duration: 700 })
    }
    return {
      data,
      createHand,
      grab, update
    }
  }
}
</script>

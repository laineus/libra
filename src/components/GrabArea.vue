<template>
  <Container :depth="100000" :x="data.x" :y="data.y" @pointerdown="grab" @preUpdate="update" />
</template>

<script>
import { Container } from 'phavuer'
import { inject, reactive } from 'vue'
export default {
  components: { Container },
  props: {
    follow: { default: null },
    name: { default: null }
  },
  emits: ['grab', 'capture', 'cancel'],
  setup (props, context) {
    const menu = inject('menu')
    const data = reactive({
      x: 0, y: 0
    })
    const grab = () => {
      menu.value.select('bag').then(menuBag => {
        context.emit('grab')
        menuBag.grabItem({ key: props.name }, 'capture').then(bool => {
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
      data,
      grab, update
    }
  }
}
</script>

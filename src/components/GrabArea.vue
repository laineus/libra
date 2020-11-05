<template>
  <Container ref="tapArea" :depth="100000" :x="data.x" :y="data.y" @pointerdown="grabItem" @preUpdate="update">
    <Image :texture="texture" :frame="frame" :originY="1" @create="initBubbleAnim" />
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { inject, reactive } from 'vue'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    frame: { default: 0 },
    texture: { default: null }
  },
  emits: ['tap'],
  setup (props, context) {
    const controller = inject('controller')
    // const scene = inject('scene')
    const menu = inject('menu')
    const tapArea = refObj(null)
    const data = reactive({
      grab: false,
      x: 0, y: 0
    })
    const grabItem = () => {
      menu.value.select(1)
      data.grab = true
    }
    const initBubbleAnim = obj => {
      // scene.add.tween({ targets: obj, alpha: 0.5, yoyo: true, repeat: -1, duration: 500 })
    }
    const update = () => {
      if (data.grab) {
        data.x = controller.value.activePointer.x
        data.y = controller.value.activePointer.y
      } else if (props.follow) {
        data.x = props.follow.x
        data.y = props.follow.y
      }
    }
    return {
      tapArea,
      data,
      grabItem, update, initBubbleAnim
    }
  }
}
</script>

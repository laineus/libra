<template>
  <Container :x="x" :y="y">
    <Circle :fillColor="0x000000" :alpha="0.5" :radius="80" @pointerdown="pointerdown" />
    <Circle :fillColor="0xFFFFFF" :alpha="0.25" :radius="30" :x="pad.x" :y="pad.y" />
  </Container>
</template>

<script>
import { Container, Circle } from 'phavuer'
import { inject, reactive, toRaw, toRefs } from 'vue'
const MAX_DISTANCE = 50
export default {
  components: { Container, Circle },
  props: ['x', 'y'],
  setup (props) {
    const scene = inject('scene')
    const data = reactive({
      stick: null,
      radian: 0,
      velocity: 0,
      velocityX: 0,
      velocityY: 0
    })
    const pad = reactive({ x: 0, y: 0 })
    const pointerdown = pointer => {
      data.stick = pointer
    }
    scene.input.on('pointermove', pointer => {
      if (toRaw(data.stick) !== pointer) return
      const distance = Math.min(Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.x, pointer.y), MAX_DISTANCE)
      const r = Math.atan2(pointer.y - pointer.downY, pointer.x - pointer.downX)
      const moveX = Math.cos(r) * distance
      const moveY = Math.sin(r) * distance
      data.radian = r
      data.velocity = distance / MAX_DISTANCE
      data.velocityX = moveX / MAX_DISTANCE
      data.velocityY = moveY / MAX_DISTANCE
      pad.x = moveX
      pad.y = moveY
    })
    scene.input.on('pointerup', pointer => {
      if (toRaw(data.stick) !== pointer) return
      data.stick = null
      data.velocity = 0
      data.velocityX = 0
      data.velocityY = 0
      pad.x = 0
      pad.y = 0
    })
    return {
      pointerdown,
      pad,
      ...toRefs(data)
    }
  }
}
</script>

<template>
  <VirtualStick ref="virtualStick" :x="100" :y="(100).byBottom" v-if="mobile" />
</template>

<script>
import { ref, inject } from 'vue'
import VirtualStick from './VirtualStick'
const wasdController = keyboard => {
  keyboard.addCapture('W,S,A,D')
  const wasd = [
    { key: keyboard.addKey('W'), x: 0, y: -1 },
    { key: keyboard.addKey('A'), x: -1, y: 0 },
    { key: keyboard.addKey('S'), x: 0, y: 1 },
    { key: keyboard.addKey('D'), x: 1, y: 0 }
  ]
  return {
    get velocity () {
      return wasd.filter(v => v.key.isDown).reduce((position, v) => {
        position.x += v.x
        position.y += v.y
        return position
      }, { x: 0, y: 0 })
    }
  }
}

export default {
  components: { VirtualStick },
  props: { velocity: { default: 25 } },
  setup (props) {
    const scene = inject('scene')
    const virtualStick = ref(null)
    const mobile = inject('mobile')
    const wasd = wasdController(scene.input.keyboard)
    return {
      mobile,
      virtualStick,
      get velocityX () {
        return (mobile ? virtualStick.value.velocityX : wasd.velocity.x) * props.velocity
      },
      get velocityY () {
        return (mobile ? virtualStick.value.velocityY : wasd.velocity.y) * props.velocity
      },
      get activePointer () {
        return scene.input.manager.pointers.find(v => v.isDown)
      }
    }
  }
}
</script>

<template>
  <VirtualStick ref="virtualStick" :x="100" :y="(100).byBottom" v-if="mobile" />
</template>

<script>
import { useScene } from 'phavuer'
import { ref, inject, onBeforeUnmount } from 'vue'
import VirtualStick from './VirtualStick.vue'
import InputController from '@/class/InputController'

export default {
  components: { VirtualStick },
  props: { velocity: { default: 25 } },
  emits: ['confirm'],
  setup (props, context) {
    const scene = useScene()
    const virtualStick = ref(null)
    const mobile = inject('mobile')
    const input = new InputController(scene.input)
    input.on('confirm', () => context.emit('confirm'))
    onBeforeUnmount(() => input.destroy())
    scene.input.mouse.disableContextMenu()
    const getVelocity = () => {
      const inputVelocity = input.velocity
      if (inputVelocity.x || inputVelocity.y) return inputVelocity
      return mobile
        ? { x: virtualStick.value?.velocityX ?? 0, y: virtualStick.value?.velocityY ?? 0 }
        : inputVelocity
    }
    return {
      mobile,
      virtualStick,
      get velocityX () {
        return getVelocity().x * props.velocity
      },
      get velocityY () {
        return getVelocity().y * props.velocity
      },
      get activePointer () {
        return scene.input.manager.pointers.find(v => v.isDown && v.button === 0)
      }
    }
  }
}
</script>

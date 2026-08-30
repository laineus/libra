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
  emits: ['confirm', 'cancel', 'grabstart', 'grabend', 'bag', 'map', 'system', 'menuleft', 'menuright'],
  setup (props, context) {
    const scene = useScene()
    const virtualStick = ref(null)
    const mobile = inject('mobile')
    const input = new InputController(scene.input)
    const gamepadConnected = ref(input.gamepadConnected)
    input.on('confirmstart', () => context.emit('confirm'))
    input.on('cancelstart', () => context.emit('cancel'))
    input.on('grabstart', () => context.emit('grabstart'))
    input.on('grabend', () => context.emit('grabend'))
    input.on('bagstart', () => context.emit('bag'))
    input.on('mapstart', () => context.emit('map'))
    input.on('systemstart', () => context.emit('system'))
    input.on('menuLeftstart', () => context.emit('menuleft'))
    input.on('menuRightstart', () => context.emit('menuright'))
    input.on('gamepadchange', connected => gamepadConnected.value = connected)
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
      gamepadConnected,
      get velocityX () {
        return getVelocity().x * props.velocity
      },
      get velocityY () {
        return getVelocity().y * props.velocity
      },
      get rightStickX () {
        return input.rightStick.x
      },
      get rightStickY () {
        return input.rightStick.y
      },
      get activePointer () {
        return scene.input.manager.pointers.find(v => v.isDown && v.button === 0)
      }
    }
  }
}
</script>

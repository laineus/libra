<template>
  <VirtualStick ref="virtualStick" :x="100" :y="(100).byBottom" v-if="mobile" />
</template>

<script>
import { useScene } from 'phavuer'
import { ref, inject } from 'vue'
import VirtualStick from './VirtualStick.vue'
const GAMEPAD_DEAD_ZONE = 0.25

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

const gamepadController = gamepadPlugin => ({
  get velocity () {
    if (!gamepadPlugin) return { x: 0, y: 0 }

    for (const pad of gamepadPlugin.gamepads) {
      if (!pad?.connected) continue

      const dpadX = Number(pad.right) - Number(pad.left)
      const dpadY = Number(pad.down) - Number(pad.up)
      if (dpadX || dpadY) return { x: dpadX, y: dpadY }

      const { x, y } = pad.leftStick
      const length = Math.hypot(x, y)
      if (length >= GAMEPAD_DEAD_ZONE) {
        return { x: x / length, y: y / length }
      }
    }
    return { x: 0, y: 0 }
  }
})

export default {
  components: { VirtualStick },
  props: { velocity: { default: 25 } },
  setup (props) {
    const scene = useScene()
    const virtualStick = ref(null)
    const mobile = inject('mobile')
    const wasd = wasdController(scene.input.keyboard)
    const gamepad = gamepadController(scene.input.gamepad)
    scene.input.mouse.disableContextMenu()
    const getVelocity = () => {
      const gamepadVelocity = gamepad.velocity
      if (gamepadVelocity.x || gamepadVelocity.y) return gamepadVelocity
      return mobile
        ? { x: virtualStick.value?.velocityX ?? 0, y: virtualStick.value?.velocityY ?? 0 }
        : wasd.velocity
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

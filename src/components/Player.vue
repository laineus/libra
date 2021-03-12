<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :texture="gun.mode.value ? 'chara_sprite/libra_gun' : 'chara_sprite/libra'" :frame="frame">
    <Body :drag="500" />
    <Light v-if="object" :x="object.x" :y="object.y" :intensity="0.1" :color="0xFF8800" :radius="10" /><!-- TODO: Tilemap will be invisible when removed all lights -->
  </Substance>
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue'
import { onPreUpdate, Body, Light } from 'phavuer'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import useGun from './modules/useGun'
export default {
  components: { Body, Light, Substance },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 }
  },
  emits: ['shot'],
  setup (props, context) {
    const gameScene = inject('gameScene')
    const scene = inject('scene')
    const event = inject('event')
    const camera = inject('camera')
    const menuOpened = inject('menuOpened')
    const field = inject('field')
    const controller = inject('controller')
    const mobile = inject('mobile')
    const state = inject('storage').state
    const substance = ref(null)
    const frame = ref(0)
    const object = computed(() => substance.value?.object)
    const following = useFollowing(object)
    const { state: frameState, play: playFrameAnim, lookTo } = useFrameAnimChara(object, props.initR, 8)
    const r = computed(() => frameState.r)
    const gun = useGun(context, object)
    const shot = () => gun.shot(r.value)
    const getRadianToPointer = () => {
      const diffX = scene.input.manager.pointers[0]?.x + camera.value?.scrollX - object.value?.x
      const diffY = scene.input.manager.pointers[0]?.y + camera.value?.scrollY - object.value?.y
      return Math.atan2(diffY, diffX)
    }
    onPreUpdate(() => {
      frame.value = playFrameAnim()
      if (!event.state && !menuOpened.value) {
        if (mobile) {
          if (controller.value.velocityX || controller.value.velocityY) {
            const x = Math.fix(field.value.player.object.x + controller.value.velocityX, 0, field.value.field.width)
            const y = Math.fix(field.value.player.object.y + controller.value.velocityY, 0, field.value.field.height)
            field.value.player.setTargetPosition(x, y)
            if (gun.mode.value) field.value.player.lookTo(Math.atan2(controller.value.velocityY, controller.value.velocityX))
          }
        } else {
          if (controller.value.activePointer) {
            const worldX = controller.value.activePointer.x + camera.value.scrollX
            const worldY = controller.value.activePointer.y + camera.value.scrollY
            if (field.value.isCollides(worldX.toTile, worldY.toTile)) return
            field.value.player.setTargetPosition(worldX, worldY)
          }
          if (gun.mode.value) lookTo(getRadianToPointer())
        }
        if (!gun.mode.value) {
          following.walkToTargetPosition(event.state ? 100 : 200)
        }
      }
      state.x = Number(object.value.x)
      state.y = Number(object.value.y)
    })
    onMounted(() => {
      substance.value.setCapturable(false)
      substance.value.hp = state.status.hp
    })
    scene.input.on('pointerdown', pointer => {
      if (event.state || menuOpened.value) return
      if (pointer.button === 0) {
        if (gun.mode.value) shot()
      } else if (pointer.button === 2) {
        gun.setMode(!gun.mode.value)
        following.clearTargetPosition()
      }
    })
    const damage = (value, r) => {
      substance.value.damage(value, r)
      state.status.hp = substance.value.hp
      if (substance.value.hp <= 0) {
        event.exec(async () => {
          await sleep(3000)
          await gameScene.value.setField('home', 0, 0)
        })
      }
    }
    const stopWalking = () => {
      following.clearTargetPosition()
      object.value.body.velocity.normalize().scale(0)
      frame.value = frameState.directionKey
    }
    return {
      object, substance,
      gun, shot,
      damage,
      r, frame, lookTo,
      stopWalking,
      hp: computed(() => substance.value?.hp),
      // Following
      setTargetPosition: following.setTargetPosition,
      clearTargetPosition: following.clearTargetPosition
    }
  }
}
</script>

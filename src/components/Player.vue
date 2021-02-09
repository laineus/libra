<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :texture="gun.mode.value ? 'chara_sprite/libra_gun' : 'chara_sprite/libra'" :frame="frame">
    <Body :drag="500" />
  </Substance>
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue'
import { onPreUpdate, Body } from 'phavuer'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import useGun from './modules/useGun'
export default {
  components: { Body, Substance },
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
    const state = inject('storage').state
    const substance = ref(null)
    const r = ref(0)
    const frame = ref(0)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    const { base: getBaseFrame, play: playFrameAnim, lookTo } = useFrameAnimChara(object, image, props.initR, 8)
    const gun = useGun(context, object)
    const getRadianToPointer = () => {
      const diffX = scene.input.manager.pointers[0]?.x + camera.value?.scrollX - object.value?.x
      const diffY = scene.input.manager.pointers[0]?.y + camera.value?.scrollY - object.value?.y
      return Math.atan2(diffY, diffX)
    }
    onPreUpdate(() => {
      r.value = getRadianToPointer()
      frame.value = playFrameAnim()
      if (gun.mode.value) {
        lookTo(r.value)
      } else {
        following.walkToTargetPosition(event.state ? 100 : 200)
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
        if (gun.mode.value) gun.shot(r.value)
      } else if (pointer.button === 2) {
        gun.setMode(!gun.mode.value)
        following.clearTargetPosition()
      }
    })
    const damage = r => {
      substance.value.damage(r)
      state.status.hp = substance.value.hp
      if (substance.value.hp <= 0) {
        event.exec(async () => {
          await sleep(3000)
          await gameScene.value.setField('home', (14).toPixelCenter, (17).toPixelCenter)
          state.status.hp = 100
        })
      }
    }
    const stopWalking = () => {
      following.clearTargetPosition()
      object.value.body.velocity.normalize().scale(0)
      frame.value = getBaseFrame()
    }
    return {
      object, substance,
      gun,
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

<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :texture="gun.mode.value ? 'chara_sprite/libra_gun' : 'chara_sprite/libra'" :frame="frame">
    <Body :drag="500" :width="20" :height="12" :offsetX="5" :offsetY="15" />
    <Image v-if="hp > 0" texture="shadow" :tint="0x000000" :scale="0.5" :alpha="0.5" :y="-3" />
    <Line v-if="gun.mode.value" :x="Math.cos(r) * 25" :y="Math.sin(r) * 25 + gunDiffY" :x2="700" :y2="0" :lineWidth="0.5" :strokeColor="config.COLORS.orange" :originX="0" :rotation="r" />
  </Substance>
</template>

<script>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue'
import { useScene, onPreUpdate, Body, Image, Line } from 'phavuer'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import useGun from './modules/useGun'
import config from '@/data/config'
export default {
  components: { Body, Image, Line, Substance },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 }
  },
  emits: ['shot'],
  setup (props, context) {
    const gameScene = inject('gameScene')
    const scene = useScene()
    const event = inject('event')
    const camera = inject('camera')
    const menuOpened = inject('menuOpened')
    const field = inject('field')
    const controller = inject('controller')
    const state = inject('storage').state
    const bag = inject('bag')
    const audio = inject('audio')
    const mobile = inject('mobile')
    const substance = ref(null)
    const data = reactive({
      frame: 0,
      speed: 200
    })
    const object = computed(() => substance.value?.object)
    const following = useFollowing(object)
    const { state: frameState, play: playFrameAnim, lookTo } = useFrameAnimChara(object, props.initR, 8)
    const r = computed(() => frameState.r)
    const gunDiffY = -40
    const gun = useGun(context, object, { y: gunDiffY })
    const shot = () => gun.shot(r.value)
    const hasGun = computed(() => bag.hasItem('gun') || bag.hasItem('revolver'))
    const gunSwitch = () => {
      if (!hasGun.value && !gun.mode.value) return
      audio.se('gun')
      gun.setMode(!gun.mode.value)
      following.clearTargetPosition()
    }
    const getRadianToPointer = () => {
      const diffX = scene.input.manager.pointers[0]?.x + camera.value?.scrollX - object.value?.x
      const diffY = scene.input.manager.pointers[0]?.y + camera.value?.scrollY - (object.value?.y + gunDiffY)
      return Math.atan2(diffY, diffX)
    }
    onPreUpdate(() => {
      data.frame = playFrameAnim()
      if (!event.state && !menuOpened.value) {
        if (controller.value.velocityX || controller.value.velocityY) {
          const x = Math.fix(object.value.x + controller.value.velocityX, 0, field.value.field.width)
          const y = Math.fix(object.value.y + controller.value.velocityY, 0, field.value.field.height)
          following.setTargetPosition(x, y)
          if (gun.mode.value) lookTo(Math.atan2(controller.value.velocityY, controller.value.velocityX))
        } else if (!mobile) {
          if (controller.value.activePointer) {
            const { x, y } = controller.value.activePointer
            if (x < 0 || y < 0 || x > config.WIDTH || y > config.HEIGHT) return
            const worldX = x + camera.value.scrollX
            const worldY = y + camera.value.scrollY
            if (field.value.isCollides(worldX.toTile, worldY.toTile)) return
            following.setTargetPosition(worldX, worldY)
          }
          if (gun.mode.value) lookTo(getRadianToPointer())
        }
      }
      if (!gun.mode.value) {
        following.walkToTargetPosition(event.state ? 100 : data.speed)
      }
      state.x = Number(object.value.x)
      state.y = Number(object.value.y)
      state.r = r.value
    })
    onMounted(() => {
      substance.value.setCapturable(false)
      substance.value.hp = state.status.hp
      if (state.amiliFollowing && field.value.name !== 'home') {
        field.value.addObject({ name: 'amili', x: props.initX, y: props.initY - 1, radian: props.initR }).then(amili => {
          amili.setTargetObject(object.value)
          amili.speed = 200
        })
      }
    })
    const onTapScreen = pointer => {
      if (event.state || menuOpened.value) return
      if (pointer.button === 0) {
        if (gun.mode.value) shot()
      } else if (pointer.button === 2) {
        gunSwitch()
      }
    }
    scene.input.on('pointerdown', onTapScreen)
    onBeforeUnmount(() => {
      scene.input.off('pointerdown', onTapScreen)
    })
    const damage = (value, r) => {
      audio.se('hit')
      substance.value.damage(value, r)
      state.status.hp = substance.value.hp
      if (substance.value.hp <= 0) {
        event.exec(async () => {
          await sleep(3000)
          await gameScene.value.setField('home', 0, 0, 0, { respawn: true })
        })
      }
    }
    const stopWalking = () => {
      following.clearTargetPosition()
      object.value.body.velocity.normalize().scale(0)
    }
    return {
      config,
      object, substance,
      gun, shot, gunSwitch, hasGun, gunDiffY,
      damage,
      ...toRefs(data),
      r, lookTo,
      stopWalking,
      hp: computed(() => substance.value?.hp),
      // Following
      setTargetPosition: following.setTargetPosition,
      clearTargetPosition: following.clearTargetPosition
    }
  }
}
</script>

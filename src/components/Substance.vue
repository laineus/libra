<template>
  <div>
    <Container ref="object" :visible="unref(visible)" :x="initX" :y="initY" :width="imgWidth" :height="imgHeight" :depth="depth" :tweens="tweens" @create="create">
      <template v-if="imageTexture">
        <Image v-if="hp > 0" ref="image" :texture="imageTexture" :frame="frame" :originX="0.5" :originY="1" :scale="scale" :alpha="alpha" :pipeline="pipeline" />
        <Break v-else :texture="imageTexture" :scale="scale" :initialFrame="frame" @broken="onBroken" />
        <Image v-if="damageEffectData.value" texture="attack" :scale="0" :alpha="1" :x="damageEffectData.diffX" :y="damageEffectData.diffY - imgHeight.half" :timeline="damageEffectTimeline" />
      </template>
      <slot />
    </Container>
    <template v-if="hp > 0 && unref(visible)">
      <Image ref="lightObject" v-if="light" :blendMode="BlendModes.OVERLAY" :x="initX" :y="initY" :depth="config.DEPTH.LIGHT" :tint="light" texture="light" />
      <TapArea v-if="tapEvent.event.value" :visible="interactive" :width="imgWidth * scale + 15" :height="imgHeight * scale + 40" :follow="object" @tap="execTapEvent" />
      <GrabArea ref="grabArea" v-else-if="capturable" :visible="grabbable" :noImage="hideGrabbable" :name="name" :scale="scale" :width="imgWidth * scale + 15" :height="imgHeight * scale + 40" :follow="object" @grab="alpha = 0.5" @capture="onBroken" @move="move" @cancel="alpha = 1" />
    </template>
  </div>
</template>

<script>
import { refObj, Container, Image, onPreUpdate } from 'phavuer'
import { computed, getCurrentInstance, inject, reactive, ref, toRefs, unref, toRaw } from 'vue'
import items from '@/data/items'
import TapArea from './TapArea'
import GrabArea from './GrabArea'
import Break from './Break'
import useEvent from './modules/useEvent'
import config from '@/data/config'
const toAdditionalString = v => v < 0 ? `-=${Math.abs(v)}` : `+=${v}`
export default {
  components: { Container, Image, TapArea, GrabArea, Break },
  props: {
    unique: { default: null },
    initX: { default: 0 },
    initY: { default: 0 },
    scale: { default: 1 },
    name: { default: null },
    texture: { default: null },
    pipeline: { default: null },
    frame: { default: '__BASE' }
  },
  emits: ['create', 'del', 'startEvent'],
  setup (props, context) {
    const self = getCurrentInstance()
    const mobile = inject('mobile')
    const frames = inject('frames')
    const field = inject('field')
    const event = inject('event')
    const camera = inject('camera')
    const player = inject('player')
    const state = inject('storage').state
    const audio = inject('audio')
    const achieve = inject('achieve')
    const object = refObj(null)
    const lightObject = refObj(null)
    const image = refObj(null)
    const grabArea = ref(null)
    const inHome = computed(() => field.value?.name === 'home')
    const imgWidth = computed(() => image.value?.width ?? 30)
    const imgHeight = computed(() => image.value?.height ?? 30)
    const depth = ref(0)
    const alpha = ref(1)
    const tapEvent = useEvent()
    const itemData = computed(() => items.find(v => v.key === props.name))
    const light = computed(() => itemData.value?.light)
    const depthAdjust = computed(() => itemData.value?.y ?? 0)
    const imageTexture = computed(() => props.texture || itemData.value?.texture)
    const capturable = computed(() => !props.unique && itemData.value?.capture && !tapEvent.event.value)
    const data = reactive({
      visible: true,
      tweens: null,
      distanceToPlayer: null,
      closeToPlayer: false,
      hp: itemData.value?.hp ?? 10
    })
    let onDestroy = null
    const setDestroyEvent = e => {
      onDestroy = e
    }
    const onBroken = () => {
      if (props.unique) {
        state.killed.push(props.unique)
        achieve.activate('murder')
      }
      onDestroy?.()
      context.emit('del')
    }
    if (props.unique && state.killed.includes(props.unique)) context.emit('del')
    const setVisible = bool => data.visible = bool
    const setCapturable = bool => data.capturable = bool
    const drop = () => {
      return new Promise(resolve => {
        const x = toAdditionalString(Math.randomInt(-12, 12))
        const y = toAdditionalString(Math.randomInt(20, 35))
        data.tweens = [
          { x, y: '-=5', duration: 100 },
          { x, y, duration: 100, onComplete: resolve }
        ]
      })
    }
    const attackAnim = r => {
      const x = toAdditionalString(Math.cos(r) * 10)
      const y = toAdditionalString(Math.sin(r) * 10)
      data.tweens = [{ x, y, duration: 80, yoyo: true }]
    }
    const damageEffectData = reactive({ value: false, diffX: 0, diffY: 0 })
    const damageEffectTimeline = { duration: 120, tweens: [{ scale: 0.6 }, { scale: 1, alpha: 0 }], onComplete: () => damageEffectData.value = false }
    let onDamage = null
    const setDamageEvent = e => {
      onDamage = e
    }
    const damage = (value, r) => {
      if (data.hp <= 0) return
      onDamage?.(value, r)
      data.hp -= value
      damageEffectData.value = true
      damageEffectData.diffX = Math.cos(r) * -15
      damageEffectData.diffY = Math.sin(r) * -15
      if (data.hp > 0) return
      if (itemData.value?.drop) {
        itemData.value.drop.filter(v => Math.chance(v.chance)).forEach(v => {
          const minScale = items.find(i => i.key === v.key).minScale
          field.value.dropItem(v.key, object.value, { scale: minScale ? Math.randomInt(minScale * 10, 10) / 10 : 1 })
        })
      }
    }
    const move = pos => {
      alpha.value = 1
      object.value.x = pos.x
      object.value.y = pos.y
      field.value.updateRoomItems()
      if (light.value) {
        field.value.resetDarkness()
        lightObject.value.x = pos.x
        lightObject.value.y = pos.y
      }
    }
    const create = obj => context.emit('create', obj)
    const interactiveAllowed = computed(() => !event.state && !player.value?.gun.mode.value && unref(data.visible))
    const interactive = computed(() => interactiveAllowed.value && data.closeToPlayer)
    const checkable = computed(() => interactive.value && tapEvent.event.value)
    const isNearest = computed(() => toRaw(field.value?.nearestGrabbable.value.value) === self.ctx)
    const grabbable = computed(() => capturable.value && (inHome.value ? interactiveAllowed.value : interactive.value))
    const hideGrabbable = computed(() => mobile ? !isNearest.value : inHome.value)
    onPreUpdate(() => {
      if (frames.game % 6 !== 0) return
      depth.value = Math.round(object.value.y + depthAdjust.value)
      data.distanceToPlayer = Phaser.Math.Distance.Between(object.value.x, object.value.y, player.value.object.x, player.value.object.y)
      data.closeToPlayer = data.distanceToPlayer < 150
      if (grabbable.value) field.value.nearestGrabbable.store(self.ctx)
    })
    const setTapEvent = (event, options = {}) => {
      if (!event) return tapEvent.setEvent(null)
      tapEvent.setEvent(computed(() => {
        const e = unref(event)
        if (!e) return null
        return async () => {
          audio.se('click')
          context.emit('startEvent', options)
          if (options.focus === false) return await e()
          const fixCamera = await camera.value.look((object.value.x + player.value.object.x).half, (object.value.y + player.value.object.y).half, 500)
          const result = await e()
          await fixCamera()
          return result
        }
      }))
    }
    return {
      config,
      itemData,
      inHome,
      capturable,
      grabArea,
      BlendModes: Phaser.BlendModes,
      unref,
      ...toRefs(data),
      checkable, grabbable, hideGrabbable,
      create,
      drop, damage, attackAnim,
      damageEffectData, damageEffectTimeline,
      object, lightObject, image,
      imageTexture,
      imgWidth, imgHeight, depth, alpha,
      light,
      move,
      tapEvent,
      execTapEvent: tapEvent.exec,
      execGrabEvent: pointer => grabArea.value.grab(pointer),
      setTapEvent,
      setDestroyEvent,
      setDamageEvent,
      onBroken,
      setVisible, setCapturable,
      destroy: () => context.emit('del')
    }
  }
}
</script>

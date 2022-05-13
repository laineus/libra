<template>
  <Substance ref="substance" :name="name" :frame="frame" @del="$emit('del')" @startEvent="startEvent">
    <Body :drag="500" :offsetX="Math.max(substance?.imgWidth - 30, 0).half" :width="Math.min(substance?.imgWidth, 30)" :height="Math.min(substance?.imgHeight, 30)" />
    <Image v-if="itemData.shadow && hp > 0" texture="shadow" :tint="0x000000" :scale="itemData.shadow" :alpha="0.5" :y="itemData.y ?? -2" />
  </Substance>
</template>

<script>
import { computed, inject, onMounted, ref, unref } from 'vue'
import { useScene, onPreUpdate, Body, Image } from 'phavuer'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import items from '@/data/items'
import { TEMPER } from '@/data/constants'
export default {
  components: { Substance, Body, Image },
  props: {
    initR: { default: 0 },
    name: { default: null },
    temper: { default: null }
  },
  emits: ['del'],
  setup (props) {
    const scene = useScene()
    const player = inject('player')
    const uiScene = inject('uiScene').value
    const event = inject('event')
    const substance = ref(null)
    const attackTarget = ref(null)
    const frame = ref(0)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    const itemData = items.find(v => v.key === props.name)
    const speed = ref(itemData?.speed || 120)
    const textureData = scene.textures.get(itemData.texture)
    const numOfDirection = Object.keys(textureData.frames).map(Number).count(Number.isInteger) / 3
    const { play: playFrameAnim, lookTo } = useFrameAnimChara(object, props.initR ?? Math.PI * Math.random(), numOfDirection, itemData?.standingAnim)
    const setTemper = temper => {
      if (temper === TEMPER.RANDOM) {
        following.setRandomWalk(150)
      } else if (temper === TEMPER.ATTACK) {
        attackTarget.value = player.value
        following.setTargetObject(player.value.object)
      } else if (temper === TEMPER.ESCAPE) {
        following.setTargetObject(player.value.object, true)
      }
    }
    const setTemperMode = mode => {
      if (!itemData) return
      setTemper(itemData.temper[mode])
    }
    onMounted(() => {
      props.temper ? setTemper(TEMPER[props.temper]) : setTemperMode('normal')
    })
    const attackDelay = ref(0)
    onPreUpdate(() => {
      if (!unref(substance.value.visible)) return
      frame.value = playFrameAnim()
      following.walkToTargetPosition(speed.value)
      // Attack
      if (!event.state && attackTarget.value?.hp > 0) {
        const diffX = attackTarget.value.object.x - object.value.x
        const diffY = attackTarget.value.object.y - object.value.y
        const distance = Math.hypot(diffX, diffY)
        distance < 70 ? attackDelay.value++ : attackDelay.value = 0
        if (attackDelay.value > 100) {
          attackDelay.value = 0
          const angle = Math.atan2(diffY, diffX)
          substance.value?.attackAnim(angle)
          attackTarget.value.damage(itemData?.atk ?? 5, angle)
          lookTo(attackTarget.value.object)
        }
      }
    })
    const damage = (value, r) => {
      if (substance.value?.tapEvent?.event.value) uiScene.setTutorial('kill')
      setTemperMode('shot')
      substance.value?.damage(value, r)
      substance.value?.setTapEvent(null)
    }
    const stopWalking = () => {
      following.setRandomWalk(false)
      following.clearTargetPosition()
      object.value.body.velocity.normalize().scale(0)
    }
    const startEvent = options => {
      stopWalking()
      if (options?.look !== false) lookTo(player.value.object)
    }
    const setTapEvent = (...arg) => {
      substance.value?.setTapEvent(...arg)
      attackTarget.value = null
      following.setTargetObject(null)
    }
    return {
      itemData,
      object, image, substance,
      frame,
      lookTo,
      damage,
      startEvent,
      speed,
      setTemper, setTemperMode,
      attackTarget,
      // Following
      stopWalking,
      setRandomWalk: following.setRandomWalk,
      setTargetPosition: following.setTargetPosition,
      setTargetObject: following.setTargetObject,
      clearTargetPosition: following.clearTargetPosition,
      // Extend from Substance
      hp: computed(() => substance.value?.hp),
      visible: computed(() => substance.value?.visible),
      checkable: computed(() => substance.value?.checkable),
      grabbable: computed(() => substance.value?.grabbable),
      distanceToPlayer: computed(() => substance.value?.distanceToPlayer),
      execTapEvent: computed(() => substance.value?.execTapEvent),
      execGrabEvent: computed(() => substance.value?.execGrabEvent),
      setDestroyEvent: computed(() => substance.value?.setDestroyEvent),
      setDamageEvent: computed(() => substance.value?.setDamageEvent),
      setTapEvent,
      setVisible: computed(() => substance.value?.setVisible),
      setCapturable: computed(() => substance.value?.setCapturable)
    }
  }
}
</script>

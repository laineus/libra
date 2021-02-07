<template>
  <Substance ref="substance" :name="name" :frame="frame" @del="$emit('del')" @startEvent="startEvent">
    <Body :drag="500" :offsetX="Math.max(substance?.imgWidth - 30, 0).half" :width="Math.min(substance?.imgWidth, 30)" :height="Math.min(substance?.imgHeight, 30)" />
    <Image v-if="attackData.effect" texture="attack" :scale="0" :alpha="1" :x="attackData.diffX" :y="attackData.diffY" :timeline="attackEffect" />
  </Substance>
</template>

<script>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { onPreUpdate, Body, Image } from 'phavuer'
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
    speed: { default: 120 },
    random: { default: null } // leave chase random null
  },
  emits: ['del'],
  setup (props, context) {
    const scene = inject('scene')
    const player = inject('player')
    const state = inject('storage').state
    const substance = ref(null)
    const frame = ref(0)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    const itemData = items.find(v => v.key === props.name)
    const speed = itemData ? itemData.speed : props.speed
    if (props.random) following.setRandomWalk(typeof props.random === 'number' ? props.random : 120)
    const textureData = scene.textures.get(itemData.texture)
    const numOfDirection = Object.keys(textureData.frames).map(Number).count(Number.isInteger) / 3
    const { base: getBaseFrame, play: playFrameAnim, lookTo } = useFrameAnimChara(object, image, props.initR, numOfDirection, itemData?.standingAnim)
    const setTemper = type => {
      if (!itemData) return
      if (itemData.temper[type] === TEMPER.RANDOM) {
        following.setRandomWalk(150)
      } else if (itemData.temper[type] === TEMPER.ATTACK) {
        following.setTargetObject(player.value.object)
      } else if (itemData.temper[type] === TEMPER.ESCAPE) {
        following.setTargetObject(player.value.object, true)
      }
    }
    onMounted(() => {
      setTemper('normal')
    })
    const attackData = reactive({
      effect: false,
      delay: 0,
      diffX: 0, diffY: 0
    })
    onPreUpdate(() => {
      frame.value = playFrameAnim()
      following.walkToTargetPosition(speed)
      // Attack
      if (following.targetObject.value) {
        const diffX = following.targetObject.value.x - object.value.x
        const diffY = following.targetObject.value.y - object.value.y
        const distance = Math.hypot(diffX, diffY)
        distance < 70 ? attackData.delay++ : attackData.delay = 0
        if (attackData.delay > 100) {
          attackData.effect = true
          attackData.delay = 0
          attackData.diffX = diffX.half
          attackData.diffY = diffY.half - 10
          state.status.hp -= 10
        }
      }
    })
    const damage = () => {
      setTemper('shot')
      substance.value?.damage()
    }
    const stopWalking = () => {
      following.setRandomWalk(false)
      following.clearTargetPosition()
      object.value.body.velocity.normalize().scale(0)
      frame.value = getBaseFrame()
    }
    const startEvent = () => {
      stopWalking()
      lookTo(player.value.object)
    }
    return {
      object, image, substance,
      frame,
      lookTo,
      damage,
      startEvent,
      attackData,
      attackEffect: { duration: 120, tweens: [{ scale: 0.6 }, { scale: 1, alpha: 0 }], onComplete: () => attackData.effect = false },
      // Following
      stopWalking,
      setTargetPosition: following.setTargetPosition,
      clearTargetPosition: following.clearTargetPosition,
      // Extend from Substance
      hp: computed(() => substance.value?.hp),
      checkable: computed(() => substance.value?.checkable),
      distanceToPlayer: computed(() => substance.value?.distanceToPlayer),
      execTapEvent: computed(() => substance.value?.execTapEvent),
      setDestroyEvent: computed(() => substance.value?.setDestroyEvent),
      setTapEvent: computed(() => substance.value?.setTapEvent),
      setVisible: computed(() => substance.value?.setVisible),
      setCapturable: computed(() => substance.value?.setCapturable)
    }
  }
}
</script>

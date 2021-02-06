<template>
  <Substance ref="substance" :name="name" :frame="frame" @del="$emit('del')">
    <Body :drag="500" :offsetX="Math.max(substance?.imgWidth - 30, 0).half" :width="Math.min(substance?.imgWidth, 30)" :height="Math.min(substance?.imgHeight, 30)" />
  </Substance>
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue'
import { onPreUpdate, Body } from 'phavuer'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import items from '@/data/items'
import { TEMPER } from '@/data/constants'
export default {
  components: { Substance, Body },
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
    const substance = ref(null)
    const frame = ref(0)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    const itemData = items.find(v => v.key === props.name)
    if (props.random) following.setRandomWalk(typeof props.random === 'number' ? props.random : 120)
    const textureData = scene.textures.get(itemData.texture)
    const numOfDirection = (textureData.frameTotal - 1) / 3
    const { play: playFrameAnim, lookTo } = useFrameAnimChara(object, image, props.initR, numOfDirection)
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
    onPreUpdate(() => {
      frame.value = playFrameAnim()
      following.walkToTargetPosition(props.speed)
    })
    const damage = () => {
      setTemper('shot')
      substance.value?.damage()
    }
    return {
      object, image, substance,
      frame,
      lookTo,
      damage,
      // Following
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

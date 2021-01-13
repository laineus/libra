<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :name="name" @del="$emit('del')">
    <Body :drag="500" :offsetX="Math.max(substance?.imgWidth - 30, 0).half" :width="Math.min(substance?.imgWidth, 30)" :height="Math.min(substance?.imgHeight, 30)" />
  </Substance>
</template>

<script>
import { computed, inject, ref } from 'vue'
import { onPreUpdate, Body } from 'phavuer'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import items from '@/data/items'
export default {
  components: { Substance, Body },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 },
    name: { default: null },
    speed: { default: 120 },
    random: { default: null } // leave chase random null
  },
  emits: ['del'],
  setup (props, context) {
    const scene = inject('scene')
    const event = inject('event')
    const substance = ref(null)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    const itemData = items.find(v => v.key === props.name)
    if (props.random) following.setRandomWalk(typeof props.random === 'number' ? props.random : 120)
    const textureData = scene.textures.get(itemData.texture)
    const numOfDirection = (textureData.frameTotal - 1) / 3
    const { play: playFrameAnim, lookTo } = useFrameAnimChara(object, image, props.initR, numOfDirection)
    onPreUpdate(() => {
      playFrameAnim()
      if (event.state) return
      following.walkToTargetPosition(props.speed)
    })
    return {
      object, substance,
      lookTo,
      damage: () => substance.value?.damage(),
      // Following
      setTargetPosition: following.setTargetPosition,
      clearTargetPosition: following.clearTargetPosition,
      // Extend from Substance
      checkable: computed(() => substance.value?.checkable),
      distanceToPlayer: computed(() => substance.value?.distanceToPlayer),
      execTapEvent: computed(() => substance.value?.execTapEvent),
      setTapEvent: computed(() => substance.value?.setTapEvent),
      setVisible: computed(() => substance.value?.setVisible),
      setCapturable: computed(() => substance.value?.setCapturable)
    }
  }
}
</script>

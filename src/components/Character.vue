<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :name="name" @create="create" @preUpdate="update" @del="$emit('del')" />
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import items from '@/data/items'
export default {
  components: { Substance },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 },
    name: { default: null },
    speed: { default: 120 },
    random: { default: null } // leave chase random null
  },
  emits: ['create', 'del'],
  setup (props, context) {
    const scene = inject('scene')
    const event = inject('event')
    const substance = ref(null)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    if (props.random) following.setRandomWalk(120)
    const itemData = items.find(v => v.key === props.name)
    const { play: playFrameAnim, lookTo } = useFrameAnimChara(object, image, props.initR, itemData.numOfDirection || 4)
    const create = obj => context.emit('create', obj)
    const update = obj => {
      playFrameAnim()
      if (event.state) return
      following.walkToTargetPosition(props.speed)
    }
    onMounted(() => {
      scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
    })
    return {
      object, substance,
      create, update,
      lookTo,
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

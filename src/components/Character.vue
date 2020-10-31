<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :name="name" @create="create" @preUpdate="update" />
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
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
  emits: ['create'],
  setup (props, context) {
    const scene = inject('scene')
    const event = inject('event')
    const substance = ref(null)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    if (props.random) following.setRandomWalk(120)
    const { play: playFrameAnim } = useFrameAnimChara(object, image, props.initR)
    const create = obj => context.emit('create', obj)
    const update = obj => {
      playFrameAnim()
      if (event.state) return
      following.walkToTargetPosition(props.speed)
    }
    onMounted((a) => {
      scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
    })
    return {
      object, image, substance,
      create, update,
      following,
      // Extend from Substance
      checkable: computed(() => substance.value?.checkable),
      distanceToPlayer: computed(() => substance.value?.distanceToPlayer),
      execTapEvent: computed(() => substance.value?.execTapEvent),
      setTapEvent: computed(() => substance.value?.setTapEvent)
    }
  }
}
</script>

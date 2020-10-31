<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :name="name" @create="create" @preUpdate="update" />
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue'
import Substance from './Substance'
import useRandomWalk from './modules/useRandomWalk'
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
    const randomWalk = props.random ? useRandomWalk(object, 100) : null
    const frameAnim = useFrameAnimChara(object, image, props.initR)
    const create = obj => context.emit('create', obj)
    const update = obj => {
      frameAnim.play()
      if (event.state) return
      if (randomWalk) randomWalk.play(pos => following.setTargetPosition(pos.x, pos.y))
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
      tapEvent: computed(() => substance.value?.tapEvent),
      setTapEvent: computed(() => substance.value?.setTapEvent)
    }
  }
}
</script>

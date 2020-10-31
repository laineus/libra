<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :name="name" @preUpdate="update" />
</template>

<script>
import { computed, inject, onMounted, reactive, ref, toRefs } from 'vue'
import Substance from './Substance'
import useRandomWalk from './modules/useRandomWalk'
import useFollowing from './modules/useFollowing'
import useFrameAnim from './modules/useFrameAnim'
const WALK_ANIM = [
  { key: 'down', frames: [1, 0, 1, 2], duration: 7 },
  { key: 'left', frames: [4, 3, 4, 5], duration: 7 },
  { key: 'right', frames: [7, 6, 7, 8], duration: 7 },
  { key: 'up', frames: [10, 9, 10, 11], duration: 7 }
]
const BASE_FRAME = { down: 1, left: 4, right: 7, up: 10 }
const velocityToDirectionKey = (x, y) => {
  if (Math.round(Math.abs(x)) > Math.round(Math.abs(y))) return x < 0 ? 'left' : 'right'
  return y < 0 ? 'up' : 'down'
}
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
    const frameAnim = useFrameAnim(WALK_ANIM, image)
    const data = reactive({
      directionKey: velocityToDirectionKey(Math.cos(props.initR), Math.sin(props.initR))
    })
    const create = obj => context.emit('create', obj)
    const update = obj => {
      if (event.state) {
        image.value.setFrame(BASE_FRAME[data.directionKey])
        return
      }
      obj.setDepth(object.value.y)
      const walking = Math.hypot(object.value.body.velocity.x, object.value.body.velocity.y) > 1
      if (randomWalk) randomWalk.play(pos => following.setTargetPosition(pos.x, pos.y))
      following.walkToTargetPosition(props.speed)
      if (walking) {
        data.directionKey = velocityToDirectionKey(object.value.body.velocity.x, object.value.body.velocity.y)
        frameAnim.play(data.directionKey)
      } else {
        image.value.setFrame(BASE_FRAME[data.directionKey])
      }
    }
    onMounted((a) => {
      scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
    })
    return {
      ...toRefs(data),
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

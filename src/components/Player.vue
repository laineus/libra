<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :name="gun.mode.value ? 'player_gun' : 'player'" @create="create" @preUpdate="update" />
</template>

<script>
import { computed, inject, onMounted, ref } from 'vue'
import Substance from './Substance'
import useFollowing from './modules/useFollowing'
import useFrameAnimChara from './modules/useFrameAnimChara'
import useGun from './modules/useGun'
export default {
  components: { Substance },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    initR: { default: 0 }
  },
  emits: ['create', 'shot'],
  setup (props, context) {
    const scene = inject('scene')
    const event = inject('event')
    const camera = inject('camera')
    const substance = ref(null)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    const { play: playFrameAnim, lookTo } = useFrameAnimChara(object, image, props.initR)
    const gun = useGun(context, object)
    const getRadianToPointer = () => {
      const diffX = scene.input.manager.pointers[0]?.x + camera.value?.scrollX - object.value?.x
      const diffY = scene.input.manager.pointers[0]?.y + camera.value?.scrollY - object.value?.y
      return Math.atan2(diffY, diffX)
    }
    const create = obj => context.emit('create', obj)
    const update = obj => {
      playFrameAnim()
      if (event.state) return
      if (gun.mode.value) {
        lookTo(getRadianToPointer())
      } else {
        following.walkToTargetPosition(200)
      }
    }
    onMounted(() => {
      scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
    })
    scene.input.on('pointerdown', pointer => {
      if (pointer.button === 0) {
        if (gun.mode.value) gun.shot(getRadianToPointer())
      } else if (pointer.button === 2) {
        gun.setMode(!gun.mode.value)
        following.clearTargetPosition()
      }
    })
    return {
      object, substance,
      create, update,
      gun,
      // Following
      setTargetPosition: following.setTargetPosition,
      clearTargetPosition: following.clearTargetPosition
    }
  }
}
</script>

<template>
  <Substance ref="substance" :initX="initX" :initY="initY" :texture="gun.mode.value ? 'chara_sprite/libra_gun' : 'chara_sprite/libra'" @create="create" @preUpdate="update" />
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
    const menuOpened = inject('menuOpened')
    const storage = inject('storage')
    const substance = ref(null)
    const r = ref(0)
    const object = computed(() => substance.value?.object)
    const image = computed(() => substance.value?.image)
    const following = useFollowing(object)
    const { play: playFrameAnim, lookTo } = useFrameAnimChara(object, image, props.initR, 8)
    const gun = useGun(context, object)
    const getRadianToPointer = () => {
      const diffX = scene.input.manager.pointers[0]?.x + camera.value?.scrollX - object.value?.x
      const diffY = scene.input.manager.pointers[0]?.y + camera.value?.scrollY - object.value?.y
      return Math.atan2(diffY, diffX)
    }
    const create = obj => context.emit('create', obj)
    const update = obj => {
      r.value = getRadianToPointer()
      playFrameAnim()
      if (event.state || menuOpened.value) return
      if (gun.mode.value) {
        lookTo(r.value)
      } else {
        following.walkToTargetPosition(200)
      }
      storage.state.x = Number(obj.x)
      storage.state.y = Number(obj.y)
    }
    onMounted(() => {
      scene.physics.world.enable(object.value)
      object.value.body.setDrag(500)
      substance.value.setCapturable(false)
    })
    scene.input.on('pointerdown', pointer => {
      if (event.state || menuOpened.value) return
      if (pointer.button === 0) {
        if (gun.mode.value) gun.shot(r.value)
      } else if (pointer.button === 2) {
        gun.setMode(!gun.mode.value)
        following.clearTargetPosition()
      }
    })
    return {
      object, substance,
      create, update,
      gun,
      r, lookTo,
      // Following
      setTargetPosition: following.setTargetPosition,
      clearTargetPosition: following.clearTargetPosition
    }
  }
}
</script>

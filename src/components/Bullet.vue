<template>
  <Rectangle ref="object" :fillColor="0xDDBB33" :width="15" :height="2" :x="initX" :y="initY" :rotation="r" @preUpdate="update" />
</template>

<script>
import { refObj, Rectangle } from 'phavuer'
import { onMounted, inject } from 'vue'
export default {
  components: { Rectangle },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    r: { default: 0 }
  },
  emits: ['del'],
  setup (props, context) {
    const scene = inject('scene')
    const field = inject('field')
    const object = refObj(null)
    onMounted(() => {
      scene.physics.world.enable(object.value)
      object.value.body.setVelocity(Math.cos(props.r), Math.sin(props.r))
      object.value.body.velocity.normalize().scale(360)
    })
    const update = obj => {
      if (field.value?.isCollides(obj.x.toTile, obj.y.toTile)) {
        context.emit('del')
      }
    }
    return {
      object,
      update
    }
  }
}
</script>

<template>
  <Rectangle ref="object" :fillColor="0xDDBB33" :width="15" :height="2" :x="initX" :y="initY" :rotation="r" />
</template>

<script>
import { refObj, Rectangle, onPreUpdate } from 'phavuer'
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
    onPreUpdate(() => {
      const obj = object.value
      const found = field.value.charas.concat(field.value.substances).map(v => v.ref.value).filter(v => v?.hp > 0 && v?.itemData?.damage).find(v => {
        return Math.abs(obj.x - v.object.x) < (v.object.width.half * v.image.scaleX) && Math.abs(obj.y - (v.object.y - v.object.height.half)) < (v.object.height.half * v.image.scaleY)
      })
      if (found) {
        context.emit('del')
        found.damage(5, props.r)
      } else if (field.value?.isCollides(obj.x.toTile, obj.y.toTile)) {
        context.emit('del')
      }
    })
    return {
      object
    }
  }
}
</script>

<template>
  <Rectangle ref="object" :fillColor="0xDDBB33" :width="15" :height="2" :x="initX" :y="initY" :rotation="r" :depth="config.DEPTH.BULLET" />
</template>

<script>
import { refObj, Rectangle, onPreUpdate } from 'phavuer'
import { unref, onMounted, inject } from 'vue'
import config from '@/data/config'
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
    const audio = inject('audio')
    const object = refObj(null)
    audio.se('shot')
    onMounted(() => {
      scene.physics.world.enable(object.value)
      object.value.body.setVelocity(Math.cos(props.r), Math.sin(props.r))
      object.value.body.velocity.normalize().scale(360)
    })
    const ceilLayers = field.value.field.tilemap.layers.filter(l => l.tilemapLayer.depth >= config.DEPTH.CEIL)
    const onCeil = (x, y) => ceilLayers.some(l => l.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
    onPreUpdate(() => {
      const obj = object.value
      const found = field.value.charas.concat(field.value.substances).map(v => v.ref.value).filter(v => unref(v.visible) && v?.hp > 0 && v?.itemData?.damage).find(v => {
        return Math.abs(obj.x - v.object.x) < (v.object.width.half * v.image.scaleX) && Math.abs(obj.y - (v.object.y - v.object.height.half)) < (v.object.height.half * v.image.scaleY)
      })
      if (found) {
        context.emit('del')
        found.damage(5, props.r)
        audio.se('damage')
      } else if (onCeil(obj.x, obj.y)) {
        context.emit('del')
      }
    })
    return {
      config,
      object
    }
  }
}
</script>

<template>
  <Image ref="object" :texture="texture" :frame="frameName" :x="setting.x" :y="setting.y" :width="32" :height="32" :originX="0" :originY="0" />
</template>

<script>
import { Image, refObj } from 'phavuer'
import { onMounted, inject } from 'vue'
export default {
  components: { Image },
  props: ['setting', 'tilesets', 'collides'],
  setup (props) {
    const scene = inject('scene')
    const object = refObj(null)
    const tileset = props.tilesets.find(v => {
      return props.setting.gid >= v.firstgid && props.setting.gid < (v.firstgid + v.total)
    })
    // Make a texture
    const frameName = `tile_${props.setting.gid - tileset.firstgid + 1}`
    if (!tileset.image.has(frameName)) {
      const { x, y } = tileset.texCoordinates[tileset.firstgid + props.setting.gid - 2]
      tileset.image.add(frameName, 0, x, y, 32, 32)
    }
    onMounted(() => {
      if (!props.collides) return
      scene.physics.world.enable(object.value)
      object.value.body.setImmovable(true)
    })
    return {
      object,
      frameName,
      texture: tileset.image.key
    }
  }
}
</script>

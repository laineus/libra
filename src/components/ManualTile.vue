<template>
  <Image ref="object" :texture="texture" :frame="frameName" :x="setting.x" :y="setting.y" :displayWidth="setting.width" :displayHeight="setting.height" :originX="0" :originY="1" />
</template>

<script>
import { Image, refObj } from 'phavuer'
import { onMounted, inject } from 'vue'
import config from '@/data/config'
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
    const index = props.setting.gid - tileset.firstgid
    const frameName = tileset.total === 1 ? '__BASE' :  `tile_${index}`
    if (!tileset.image.has(frameName)) {
      const { x, y } = tileset.texCoordinates[index]
      tileset.image.add(frameName, 0, x, y, config.TILE_SIZE, config.TILE_SIZE)
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

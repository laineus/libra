<template>
  <Image ref="object" :texture="texture" :x="setting.x" :y="setting.y" :displayWidth="setting.width" :displayHeight="setting.height" :originX="0" :originY="1">
    <StaticBody v-if="physics" :width="physics.width * object?.scaleX" :height="physics.height * object?.scaleY" :offsetX="physics.x" :offsetY="physics.y" />
  </Image>
</template>

<script>
import { Image, refObj, StaticBody } from 'phavuer'
import { inject } from 'vue'
export default {
  components: { Image, StaticBody },
  props: ['setting', 'field'],
  setup (props) {
    const scene = inject('scene')
    const object = refObj(null)
    const tileset = scene.cache.tilemap.get(props.field.name).data.tilesets.filter(v => v.tiles).find(v => {
      const maxId = v.tiles.findMax(t => t.id).id
      return props.setting.gid >= v.firstgid && props.setting.gid < (v.firstgid + maxId + 1)
    })
    const tile = tileset.tiles.find(v => (v.id + tileset.firstgid) === props.setting.gid)
    const texture = `tileset/${tile.image.split('/').slice(-1)[0].split('.')[0]}`
    const physics = tile.objectgroup?.objects[0]
    return {
      object, physics,
      texture
    }
  }
}
</script>

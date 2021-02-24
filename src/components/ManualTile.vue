<template>
  <Image ref="object" :texture="texture" :x="setting.x" :y="setting.y" :rotation="setting.radian ?? 0" :displayWidth="setting.width" :displayHeight="setting.height" :originX="0" :originY="1" :flipX="setting.flippedHorizontal" :flipY="setting.flippedVertical" :depth="depth">
    <StaticBody v-if="physics && object" :width="physics.width * object.scaleX" :height="physics.height * object.scaleY" :offsetX="physics.x * object.scaleX" :offsetY="physics.y * object.scaleY" />
  </Image>
</template>

<script>
import { Image, refObj, StaticBody } from 'phavuer'
import { inject } from 'vue'
import config from '@/data/config'
export default {
  components: { Image, StaticBody },
  props: ['setting', 'field'],
  setup (props) {
    const scene = inject('scene')
    const object = refObj(null)
    const map = scene.cache.tilemap.get(props.field.name).data
    const originalLayerIndex = map.layers.findIndex(v => v.objects?.some(o => o.id === props.setting.id))
    const layerIndex = map.layers.slice(0, originalLayerIndex).count(v => v.type === 'tilelayer') - 1
    const tileset = map.tilesets.filter(v => v.tiles).find(v => {
      const maxId = v.tiles.findMax(t => t.id).id
      return props.setting.gid >= v.firstgid && props.setting.gid < (v.firstgid + maxId + 1)
    })
    const tile = tileset.tiles.find(v => (v.id + tileset.firstgid) === props.setting.gid)
    const depthName = tile.properties?.find(v => v.name === 'depth')?.value
    const depth = depthName === 'SUBSTANCE' ? props.setting.y : (config.DEPTH[depthName] ?? layerIndex)
    const texture = `tileset/${tile.image.split('/').slice(-1)[0].split('.')[0]}`
    const physics = tile.objectgroup?.objects[0]
    return {
      object, physics,
      texture,
      depth
    }
  }
}
</script>

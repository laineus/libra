<template>
  <div>
    <TilemapLayer v-for="v in layers" :key="v.index" :ref="v.ref" :depth="config.DEPTH[v.depth] ?? v.index" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" :collisionByProperty="{ collides: true}" :pipeline="pipeline" @create="layerCreate" />
    <ManualTile v-for="v in manualTiles" :key="v.id" :setting="v" :field="field" @create="layerCreate" />
    <Image v-for="(v, i) in images" :key="i" :ref="v.ref" :texture="`tileset/${v.key}`" :x="v.x" :y="v.y" :origin="0" :pipeline="pipeline" @create="obj => obj.setDepth(obj.y + obj.height)" />
    <Player ref="player" :initX="playerX" :initY="playerY" :initR="playerR" :pipeline="pipeline" @create="charaCreate" @shot="addBullet" />
    <Character v-for="v in charas" :key="v.id" :ref="v.ref" :unique="v.unique && `${name}_${v.id}`" :initX="v.x" :initY="v.y" :initR="v.radian" :name="v.name" :scale="v.scale" :random="v.random" :pipeline="pipeline" @create="charaCreate" @del="delObject(v.id)" />
    <Substance v-for="v in substances" :key="v.id" :ref="v.ref" :unique="v.unique && `${name}_${v.id}`" :initX="v.x" :initY="v.y" :name="v.name" :scale="v.scale" :pipeline="pipeline" @del="delObject(v.id)" />
    <Area v-for="v in areas" :key="v.id" :ref="v.ref" :x="v.x" :y="v.y" :width="v.width" :height="v.height" />
    <Gate v-for="v in gates" :key="v.id" :ref="v.ref" :x="v.x" :y="v.y" :width="v.width" :height="v.height" :to="{ key: v.name, x: v.fieldX.toPixel, y: v.fieldY.toPixel, r: player?.r }" />
    <Bullet v-for="v in bullets" :key="v.id" :initX="v.x" :initY="v.y" :r="v.r" @del="delBullet(v.id)" />
    <Image :depth="config.DEPTH.DARKNESS" texture="darkness" :x="0" :y="0" :origin="0" />
  </div>
</template>

<script>
import fieldService from './modules/fieldService'
import Player from './Player'
import Character from './Character'
import Substance from './Substance'
import Area from './Area'
import Gate from './Gate'
import Bullet from './Bullet'
import ManualTile from './ManualTile'
import Darkness from './modules/Darkness'
import { inject, onBeforeUnmount, onMounted, ref, computed, shallowReactive, nextTick, watch } from 'vue'
import { refObj, Image, TilemapLayer } from 'phavuer'
import setupCamera from './modules/setupCamera'
import randomObjectByRandom from './modules/randomObjectByRandom'
import maps from '@/data/maps'
import config from '@/data/config'
import items from '@/data/items'
export default {
  components: { TilemapLayer, Image, Player, Character, Substance, Area, Gate, Bullet, ManualTile },
  props: [
    'fieldKey', 'playerX', 'playerY', 'playerR'
  ],
  setup (props) {
    const scene = inject('scene')
    const audio = inject('audio')
    const state = inject('storage').state
    const player = ref(null)
    const field = fieldService(scene, props.fieldKey)
    console.log(field)
    const layers = field.layers.map(v => Object.assign({ ref: refObj(null) }, v))
    const images = field.images.map(v => Object.assign({ ref: refObj(null) }, v))
    const objects = shallowReactive(field.objects.map(v => Object.assign({ ref: ref(null) }, v)))
    const manualTiles = computed(() => objects.filter(v => 'gid' in v))
    const charas = computed(() => objects.filter(v => v.type === 'Character'))
    const substances = computed(() => objects.filter(v => v.type === 'Substance'))
    const areas = computed(() => objects.filter(v => v.type === 'Area'))
    const gates = computed(() => objects.filter(v => v.type === 'Gate'))
    const positions = computed(() => objects.filter(v => v.type === 'Position').toObject(v => [v.name, { x: v.x, y: v.y }]))
    const lightSubstances = computed(() => substances.value.filter(v => v.ref.value?.light))
    scene.lights.setAmbientColor(field.properties.ambient ?? 0xFFFFFF).enable()
    const pipeline = computed(() => lightSubstances.value.length ? 'Light2D' : 'TextureTintPipeline')
    const addObject = object => {
      const itemData = items.find(v => v.key === object.name)
      const obj = Object.assign({ ref: ref(null), id: Symbol('id'), type: itemData.type }, object)
      objects.push(obj)
      return new Promise(resolve => {
        nextTick(() => resolve(obj.ref.value))
      })
    }
    const delObject = itemOrId => objects.delete(typeof itemOrId === 'object' ? itemOrId : v => v.id === itemOrId)
    const dropItem = (name, gameObject, options) => {
      return addObject(Object.assign({ name, x: gameObject.x, y: gameObject.y }, options)).then(v => v.drop?.())
    }
    const bullets = shallowReactive([])
    const addBullet = ({ x, y, r }) => bullets.push({ id: Symbol('bullet_id'), x, y, r })
    const delBullet = itemOrId => bullets.delete(typeof itemOrId === 'object' ? itemOrId : v => v.id === itemOrId)
    const isCollides = (tileX, tileY) => {
      return layers.some(layer => layer.ref.value.getTileAt(tileX, tileY)?.collides)
    }
    const getObjectById = id => objects.find(v => v.id === id)?.ref.value
    randomObjectByRandom(objects.filter(v => v.type === 'Random')).forEach(addObject)
    const layerGroup = scene.add.group()
    const objectGroup = scene.add.group()
    scene.physics.add.collider(layerGroup, objectGroup)
    const layerCreate = layer => {
      layerGroup.add(layer)
    }
    const charaCreate = obj => {
      objectGroup.add(obj)
    }
    const event = maps[props.fieldKey] || {}
    scene.textures.remove('darkness')
    const darkness = new Darkness(scene, 'darkness', field.width, field.height)
    const resetDarkness = () => {
      const arcs = lightSubstances.value.map(v => {
        return { x: v.x, y: v.y, radius: 120 }
      })
      darkness.clear().fillBg(field.properties.darkness ?? 0x77000000).removeArcs(arcs).save().refresh()
    }
    watch(() => lightSubstances.value.length, resetDarkness)
    const respawn = state.status.hp <= 0
    if (respawn) state.status.hp = 100
    onMounted(() => {
      resetDarkness()
      setupCamera(inject('camera').value, field.width, field.height, player.value.object)
      event.create?.({ respawn })
      audio.setBgm(event.bgm || null)
    })
    onBeforeUnmount(() => {
      darkness.destroy()
      event.destroy?.()
    })
    const update = (time) => {
      darkness.restore().removeArc(player.value.object.x, player.value.object.y, 300).refresh()
      field.update(time)
      if (event.update) event.update()
    }
    return {
      config,
      field,
      name: field.name, width: field.width, height: field.height,
      layers, images, player, objects, charas, substances, areas, gates, positions, manualTiles,
      pipeline,
      addObject, delObject, dropItem,
      bullets, addBullet, delBullet,
      isCollides, getObjectById,
      layerCreate, charaCreate,
      play: update
    }
  }
}
</script>

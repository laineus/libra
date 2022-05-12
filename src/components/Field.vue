<template>
  <div>
    <TilemapLayer v-for="v in layers" :key="v.index" :ref="v.ref" :depth="config.DEPTH[v.depth] ?? v.index" :tilemap="field.tilemap" :layerIndex="v.index" :tileset="field.tilesets" :collisionByProperty="{ collides: true}" @create="layerCreate" />
    <ManualTile v-for="v in manualTiles" :key="v.id" :setting="v" :field="field" @create="layerCreate" />
    <Image v-for="(v, i) in images" :key="i" :ref="v.ref" :texture="`tileset/${v.key}`" :x="v.x" :y="v.y" :origin="0" @create="obj => obj.setDepth(obj.y + obj.height)" />
    <Player ref="player" :initX="playerX" :initY="playerY" :initR="playerR" @create="charaCreate" @shot="addBullet" />
    <Character v-for="v in charas" :key="v.id" :ref="v.ref" :unique="v.unique && `${name}_${v.id}`" :initX="v.x" :initY="v.y" :initR="v.radian" :name="v.name" :scale="v.scale" :temper="v.temper" @create="charaCreate" @del="delObject(v.id)" />
    <Substance v-for="v in substances" :key="v.id" :ref="v.ref" :unique="v.unique && `${name}_${v.id}`" :initX="v.x" :initY="v.y" :name="v.name" :scale="v.scale" @del="delObject(v.id)" />
    <Area v-for="v in areas" :key="v.id" :ref="v.ref" :x="v.x" :y="v.y" :width="v.width" :height="v.height" />
    <Gate v-for="v in gates" :key="v.id" :ref="v.ref" :x="v.x" :y="v.y" :width="v.width" :height="v.height" :to="{ key: v.name, x: v.fieldX.toPixelCenter, y: v.fieldY.toPixelCenter, r: player?.r }" />
    <Bullet v-for="v in bullets" :key="v.id" :initX="v.x" :initY="v.y" :r="v.r" @del="delBullet(v.id)" />
    <Image :depth="config.DEPTH.DARKNESS" texture="darkness" :x="0" :y="0" :origin="0" :scale="20" />
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
import { useScene, refObj, Image, TilemapLayer } from 'phavuer'
import setupCamera from './modules/setupCamera'
import randomObjectByRandom from './modules/randomObjectByRandom'
import maps from '@/data/maps'
import config from '@/data/config'
import items from '@/data/items'
import { INTRO_STEPS } from '@/data/eventSteps'
export default {
  components: { TilemapLayer, Image, Player, Character, Substance, Area, Gate, Bullet, ManualTile },
  props: [
    'fieldKey', 'playerX', 'playerY', 'playerR', 'payload'
  ],
  setup (props) {
    const scene = useScene()
    const frames = inject('frames')
    const audio = inject('audio')
    const state = inject('storage').state
    const menu = inject('menu')
    menu.value?.close()
    const player = ref(null)
    const field = fieldService(scene, props.fieldKey)
    const isRoom = field.name === 'home'
    if (ENV === 'development') console.log(field)
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
    const addObject = object => {
      const itemData = items.find(v => v.key === object.name)
      const obj = Object.assign({ ref: ref(null), id: Symbol('id'), type: itemData.type }, object)
      if (isRoom) obj.temper = 'RANDOM'
      objects.push(obj)
      return new Promise(resolve => {
        nextTick(() => resolve(obj.ref.value))
      })
    }
    const delObject = itemOrId => objects.delete(typeof itemOrId === 'object' ? itemOrId : v => v.id === itemOrId)
    const dropItem = (name, gameObject, options) => {
      return addObject(Object.assign({ name, x: gameObject.x, y: gameObject.y }, options)).then(v => v.drop?.())
    }
    // Field apples
    state.fieldApples.filter(v => v.map === field.name).forEach(v => addObject({ name: 'apple', x: v.x, y: v.y }))
    state.fieldApples = state.fieldApples.filter(v => v.map !== field.name)
    // Room items
    if (isRoom) state.roomItems.forEach(v => addObject({ id: v.id, name: v.key, x: v.x, y: v.y, scale: v.scale }))
    const updateRoomItems = () => {
      if (!isRoom) return
      state.roomItems = objects.filter(v => ['Character', 'Substance'].includes(v.type) && v.name !== 'amili').map(item => {
        return { id: item.id, key: item.name, x: item.ref.value?.object.x ?? item.x, y: item.ref.value?.object.y ?? item.y, scale: item.scale }
      })
    }
    const unwatchItems = watch(() => objects.length, updateRoomItems)

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
    const darkness = new Darkness(scene, 'darkness', field.width, field.height, 20)
    const resetDarkness = () => {
      const arcs = lightSubstances.value.map(v => {
        return { x: v.x, y: v.y, radius: 120 }
      })
      darkness.clear().fillBg(field.properties.darkness ?? 0x77000000).removeArcs(arcs).save().refresh()
    }
    const unwatchLights = watch(() => lightSubstances.value.length, resetDarkness) // TODO: unwatch
    if (state.status.hp <= 0) state.status.hp = 100
    onMounted(() => {
      resetDarkness()
      setupCamera(inject('camera').value, field.width, field.height, player.value.object)
      audio.setBgm(event.bgm || null)
      event.create?.(props.payload)
    })
    onBeforeUnmount(() => {
      if (!isRoom && state.events.intro !== INTRO_STEPS.APPLE) {
        const apples = objects.filter(v => v.name === 'apple' && v.ref?.value).map(v => {
          return { map: field.name, x: v.x, y: v.y }
        })
        state.fieldApples.push(...apples)
      }
      darkness.destroy()
      event.destroy?.()
      unwatchItems()
      unwatchLights()
    })
    const nearestCheckable = ref(null)
    const nearestGrabbable = ref(null)
    const update = (time) => {
      if (frames.game % 6 === 3) {
        const refs = objects.map(v => v.ref.value)
        nearestCheckable.value = refs.filter(v => v?.checkable).findMin(v => v.distanceToPlayer)
        nearestGrabbable.value = refs.filter(v => v?.grabbable).findMin(v => v.distanceToPlayer)
      }
      if (frames.game % 2 === 0) darkness.restore().removeArc(player.value.object.x, player.value.object.y, 300).refresh()
      field.update(time)
      if (event.update) event.update()
    }
    return {
      config,
      field,
      name: field.name, width: field.width, height: field.height,
      layers, images, player, objects, charas, substances, areas, gates, positions, manualTiles,
      addObject, delObject, dropItem, updateRoomItems,
      bullets, addBullet, delBullet,
      nearestCheckable, nearestGrabbable,
      isCollides, getObjectById,
      layerCreate, charaCreate,
      resetDarkness,
      play: update
    }
  }
}
</script>

<template>
  <div class="debug">
    <select v-model="selectedMap" @change="changeMap">
      <option value="" />
      <option v-for="v in mapList" :key="v.name" :value="v">{{ v.name }}</option>
    </select>
    <select v-model="selectedItem" @change="changeItem">
      <option value="" />
      <option v-for="v in items" :key="v.key" :value="v">{{ v.key }}</option>
    </select>
  </div>
</template>

<script>
import assets from '../assets.json'
import { ref, inject } from 'vue'
import items from '@/data/items'
export default {
  setup () {
    const game = inject('game')
    const gameScene = inject('gameScene')
    const uiScene = inject('uiScene')
    const storage = inject('storage')
    window.assets = assets
    window.game = game
    window.state = storage.state
    const selectedMap = ref(null)
    const mapList = assets.tilemapTiledJSONExternal.map(v => {
      return { name: v[0], x: 400, y: 400 }
    })
    const changeMap = () => {
      if (!selectedMap.value) return
      uiScene.value.titleScreen = false
      const { name, x, y } = selectedMap.value
      gameScene.value.setField(name, x, y)
    }
    const selectedItem = ref(null)
    const changeItem = () => {
      if (!selectedItem.value) return
      storage.state.bagItems.push({
        id: Math.randomInt(1000000, 9999999),
        key: selectedItem.value.key,
        scale: selectedItem.value.minScale ? Math.randomInt(selectedItem.value.minScale * 10, 10) / 10 : 1,
        bagX: Math.randomInt(30, 200),
        bagY: Math.randomInt(60, 410)
      })
      uiScene.value.menu.select('bag')
      // selectedItem.value = null
    }
    return {
      selectedMap,
      mapList,
      changeMap,
      items,
      selectedItem,
      changeItem
    }
  }
}
</script>

<style scoped>
.debug {
  position: fixed;
  top: 10px;
  left: 10px;
}
</style>

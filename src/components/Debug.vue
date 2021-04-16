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
    <button @click="stateModal = true">State</button>
    <div class="modal" v-if="stateModal" @click="stateModal = false">
      <div class="modal-content" @click.stop>
        <textarea v-model="json" />
        <button @click="importState">Import</button>
        <button @click="exportState">Export</button>
      </div>
    </div>
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
    const json = ref(null)
    const stateModal = ref(null)
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
    const importState = () => {
      Object.assign(storage.state, JSON.parse(json.value))
      gameScene.value.setField(storage.state.map, storage.state.x, storage.state.y)
    }
    const exportState = () => {
      json.value = JSON.stringify(storage.state)
    }
    return {
      importState,
      exportState,
      json,
      stateModal,
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
button {
  padding: 0 8px;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  padding: 10px;
  background: #FFF;
}
.modal-content textarea {
  display: block;
  width: 400px;
  height: 200px;
}
.modal-content button {
  margin: 8px 8px 0 0;
}
</style>

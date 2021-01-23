<template>
  <div class="debug">
    <select v-model="selectedMap" @change="changeMap">
      <option value="" />
      <option v-for="v in mapList" :key="v.name" :value="v">{{ v.name }}</option>
    </select>
  </div>
</template>

<script>
import assets from 'assets'
import { ref, inject } from 'vue'
export default {
  setup () {
    const game = inject('game')
    const gameScene = inject('gameScene')
    const uiScene = inject('uiScene')
    const storage = inject('storage')
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
    return {
      selectedMap,
      mapList,
      changeMap
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

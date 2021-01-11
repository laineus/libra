<template>
  <div class="debug">
    <select v-model="selectedMap" @change="changeMap">
      <option value="" />
      <option v-for="v in mapList" :key="v.name" :value="v">{{ v.name }}</option>
    </select>
  </div>
</template>

<script>
import { ref, inject } from 'vue'
export default {
  setup () {
    const gameScene = inject('gameScene')
    const uiScene = inject('uiScene')
    const selectedMap = ref(null)
    const mapList = [
      { name: 'home1', x: 540, y: 360 },
      { name: 'stomach1', x: 800, y: 240 },
      { name: 'forest2', x: 300, y: 550 },
      { name: 'forest3', x: 500, y: 800 },
      { name: 'forest4', x: 800, y: 300 },
      { name: 'forest5', x: 500, y: 360 }
    ]
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

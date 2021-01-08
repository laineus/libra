<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="tap" />
  <Text :text="`${v.name} ${v.state?.map ?? 'empty'}`" color="white" v-for="(v, i) in list" :key="v.number" :x="40" :y="40 + (i * 30)" @pointerdown="load(v)" />
</template>

<script>
import { inject, ref } from 'vue'
import { Rectangle } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
export default {
  components: { Rectangle, Text },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    const storage = inject('storage')
    const list = ref(null)
    storage.getList().then(v => {
      list.value = v
    })
    return {
      config,
      list,
      tap: async () => {
        // await gameScene.value.setField('forest1', 300, 552, -Math.PI.half)
        await gameScene.value.setField('forest3', 800, 452, -Math.PI.half)
        context.emit('close')
      },
      load: async data => {
        if (!data.state) return
        await storage.load(data.number)
        await gameScene.value.setField(storage.state.map, storage.state.x, storage.state.y, -Math.PI.half)
        context.emit('close')
      }
    }
  }
}
</script>

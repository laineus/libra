<template>
  <Rectangle :fillColor="0x333333" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="tap" />
</template>

<script>
import { inject } from 'vue'
import { Rectangle } from 'phavuer'
import config from '@/data/config'
export default {
  components: { Rectangle },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    return {
      config,
      tap: async () => {
        // await gameScene.value.setField('forest1', 300, 552, -Math.PI.half)
        await gameScene.value.setField('forest3', 800, 452, -Math.PI.half)
        context.emit('close')
      }
    }
  }
}
</script>

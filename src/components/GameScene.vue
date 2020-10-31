<template>
  <Scene ref="scene" name="GameScene" :autoStart="true" @update="update">
    {{ fps }}
    <Field ref="field" v-if="fieldData.name" :fieldKey="fieldData.name" :playerX="fieldData.x" :playerY="fieldData.y" :playerR="fieldData.r" />
  </Scene>
</template>

<script>
import { ref, reactive, provide, inject, nextTick } from 'vue'
import { refScene, Scene } from 'phavuer'
import Field from './Field'
export default {
  components: { Scene, Field },
  setup (props, context) {
    const fieldData = reactive({ name: null, x: 0, y: 0, r: 0 })
    const scene = refScene(null)
    const frames = inject('frames')
    const uiScene = inject('uiScene')
    const camera = inject('camera')
    const field = ref(null)
    const fps = ref(0)
    provide('field', field)
    const update = (scene, time) => {
      frames.game++
      if (!field.value) return
      fps.value = Math.round(scene.game.loop.actualFps)
      field.value.play(time)
      const controller = uiScene.value.controller
      if (controller.velocityX || controller.velocityY) {
        const x = Math.fix(field.value.player.object.x + controller.velocityX, 0, field.value.field.width)
        const y = Math.fix(field.value.player.object.y + controller.velocityY, 0, field.value.field.height)
        field.value.player.following.setTargetPosition(x, y)
      } else if (controller.activePointer) {
        const worldX = controller.activePointer.x + camera.value.scrollX
        const worldY = controller.activePointer.y + camera.value.scrollY
        if (field.value.isCollides(worldX.toTile, worldY.toTile)) return
        field.value.player.following.setTargetPosition(worldX, worldY)
      }
    }
    const setField = async (name, x, y, r) => {
      await uiScene.value.transition(200)
      fieldData.name = null
      nextTick(() => {
        fieldData.name = name
        fieldData.x = x
        fieldData.y = y
        fieldData.r = r
      })
    }
    return {
      fps,
      scene,
      field,
      update,
      fieldData,
      setField
    }
  }
}
</script>

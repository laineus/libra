<template>
  <Scene ref="scene" name="GameScene" :autoStart="true" @update="update">
    <template v-if="false">{{ fps }}</template>
    <Field ref="field" v-if="fieldData.name" :fieldKey="fieldData.name" :playerX="fieldData.x" :playerY="fieldData.y" :playerR="fieldData.r" />
  </Scene>
</template>

<script>
import { ref, reactive, provide, inject, nextTick, onMounted } from 'vue'
import { refScene, Scene } from 'phavuer'
import Field from './Field'
export default {
  components: { Scene, Field },
  setup (props, context) {
    const fieldData = reactive({ name: null, x: 0, y: 0, r: 0 })
    const scene = refScene(null)
    const event = inject('event')
    const menuOpened = inject('menuOpened')
    const frames = inject('frames')
    const uiScene = inject('uiScene')
    const controller = inject('controller')
    const camera = inject('camera')
    const storage = inject('storage')
    const field = ref(null)
    const fps = ref(0)
    provide('field', field)
    onMounted(() => {
      scene.value.input.setTopOnly(false)
    })
    const update = (scene, time) => {
      frames.game++
      if (!field.value) return
      fps.value = Math.round(scene.game.loop.actualFps)
      field.value.play(time)
      if (!event.state && !menuOpened.value) {
        if (controller.value.velocityX || controller.value.velocityY) {
          const x = Math.fix(field.value.player.object.x + controller.value.velocityX, 0, field.value.field.width)
          const y = Math.fix(field.value.player.object.y + controller.value.velocityY, 0, field.value.field.height)
          field.value.player.lookTo(Math.atan2(controller.value.velocityY, controller.value.velocityX))
          field.value.player.setTargetPosition(x, y)
        } else if (controller.value.activePointer) {
          const worldX = controller.value.activePointer.x + camera.value.scrollX
          const worldY = controller.value.activePointer.y + camera.value.scrollY
          if (field.value.isCollides(worldX.toTile, worldY.toTile)) return
          field.value.player.setTargetPosition(worldX, worldY)
        }
      }
    }
    const setField = async (name, x, y, r) => {
      const completeTransition = await uiScene.value.transition(200)
      fieldData.name = null
      uiScene.value.setMapName(null)
      nextTick(() => {
        storage.state.map = name
        fieldData.name = name
        fieldData.x = x
        fieldData.y = y
        fieldData.r = r
        uiScene.value.setMapName(t(`place.${name}`))
      })
      completeTransition()
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

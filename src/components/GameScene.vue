<template>
  <Scene ref="scene" name="GameScene" :autoStart="true" @update="update">
    <template v-if="false">{{ fps }}</template>
    <Field ref="field" v-if="fieldData.name" :fieldKey="fieldData.name" :playerX="fieldData.x" :playerY="fieldData.y" :playerR="fieldData.r" :payload="fieldData.payload" />
  </Scene>
</template>

<script>
import { ref, reactive, provide, inject, nextTick, onMounted } from 'vue'
import { refScene, Scene } from 'phavuer'
import Field from './Field'
export default {
  components: { Scene, Field },
  setup (props, context) {
    const fieldData = reactive({ name: null, x: 0, y: 0, r: 0, payload: undefined })
    const scene = refScene(null)
    const frames = inject('frames')
    const uiScene = inject('uiScene')
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
    }
    const setField = async (name, x, y, r, payload) => {
      const completeTransition = await uiScene.value.transition(payload?.transition ?? 200)
      fieldData.name = null
      uiScene.value.setMapName(null)
      nextTick(() => {
        storage.state.map = name
        fieldData.name = name
        fieldData.x = x
        fieldData.y = y
        fieldData.r = r
        fieldData.payload = payload
        uiScene.value.setMapName(t(`place.${name}`))
      })
      completeTransition()
    }
    const backToTitle = () => {
      fieldData.name = null
      uiScene.value.titleScreen = true
    }
    return {
      fps,
      scene,
      field,
      update,
      fieldData,
      setField,
      backToTitle
    }
  }
}
</script>

<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @create="create" @update="update">
    <Title @close="titleScreen = false" v-if="titleScreen" />
    <template v-else>
      <Controller ref="controller" />
      <Circle :visible="mobile && nealestCheckable" :radius="80" :fillColor="0x000000" :alpha="0.5" :x="(100).byRight" :y="(100).byBottom" @pointerdown="check" />
      <Talk ref="talk" />
    </template>
    <Rectangle :fillColor="0x000000" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="config.DEPTH.TRANSITION" :alpha="transitionAlpha" />
  </Scene>
</template>

<script>
import { inject, ref } from 'vue'
import { refScene, Scene, Rectangle, Circle } from 'phavuer'
import Title from './Title'
import Controller from './Controller'
import Talk from './Talk'
import config from '@/data/config'
export default {
  components: { Scene, Title, Controller, Rectangle, Circle, Talk },
  setup (props) {
    const mobile = inject('mobile')
    const frames = inject('frames')
    const field = inject('field')
    const scene = refScene(null)
    const titleScreen = ref(true)
    const transitionAlpha = ref(0)
    const nealestCheckable = ref(null)
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
      frames.total++
      if (!field.value) return
      nealestCheckable.value = field.value.charas.concat(field.value.substances).map(v => v.ref.value).filter(v => v.checkable).findMin(v => v.distanceToPlayer)
    }
    const transition = (duration = 500) => {
      return new Promise(resolve => {
        transitionAlpha.value = 0
        scene.value.add.tween({ targets: transitionAlpha, duration, hold: duration.half, value: 1, yoyo: true, onYoyo: resolve })
      })
    }
    return {
      mobile,
      config,
      create, update,
      scene, controller: ref(null), talk: ref(null),
      titleScreen,
      transition,
      transitionAlpha,
      nealestCheckable,
      check: () => {
        if (!nealestCheckable.value) return
        nealestCheckable.value.tapEvent.exec()
      }
    }
  }
}
</script>

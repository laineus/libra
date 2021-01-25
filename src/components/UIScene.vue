<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @update="update">
    <Title @close="titleScreen = false" v-if="titleScreen" />
    <template v-else>
      <Controller ref="controller" />
      <Circle :visible="mobile && nealestCheckable" :radius="80" :fillColor="0x000000" :alpha="0.5" :x="(100).byRight" :y="(100).byBottom" @pointerdown="check" />
      <Talk ref="talk" />
      <Selector v-if="selector.list" :x="selector.x" :y="selector.y" :list="selector.list" @select="selector.resolver" />
      <Log ref="log" />
      <Menu ref="menu" />
      <Image v-for="v in 5" :key="v" texture="hp" :frame="Math.round(state.status.hp / 20) >= v ? 0 : 1" :x="40 + ((v - 1) * 42)" :y="(35).byBottom" />
    </template>
    <Rectangle :fillColor="0x000000" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="config.DEPTH.TRANSITION" :alpha="transitionAlpha" />
    <Text v-if="screenMessage" :text="screenMessage" :x="config.WIDTH.half" :y="config.HEIGHT.half" :size="17" color="white" :origin="0.5" :depth="config.DEPTH.TRANSITION" />
  </Scene>
</template>

<script>
import { inject, reactive, ref } from 'vue'
import { refScene, Scene, Rectangle, Circle, Image } from 'phavuer'
import Title from './Title'
import Controller from './Controller'
import Talk from './Talk'
import Selector from './Selector'
import Menu from './Menu'
import Log from './Log'
import Text from './Text'
import config from '@/data/config'
export default {
  components: { Scene, Title, Controller, Rectangle, Circle, Image, Talk, Selector, Menu, Log, Text },
  setup (props) {
    const mobile = inject('mobile')
    const frames = inject('frames')
    const field = inject('field')
    const storage = inject('storage')
    const camera = inject('camera')
    const player = inject('player')
    const refs = {
      scene: refScene(null),
      controller: ref(null),
      talk: ref(null),
      log: ref(null),
      menu: ref(null)
    }
    const titleScreen = ref(true)
    const transitionAlpha = ref(0)
    const screenMessage = ref(null)
    const setScreenMessage = text => screenMessage.value = text
    const nealestCheckable = ref(null)
    const selector = reactive({ list: null, resolver: null, x: 0, y: 0 })
    const setSelector = list => {
      return new Promise(resolve => {
        selector.list = list
        selector.x = player.value?.object.x - camera.value?.scrollX
        selector.y = player.value?.object.y - camera.value?.scrollY - 50
        selector.resolver = result => {
          selector.list = null
          selector.resolver = null
          resolve(result)
        }
      })
    }
    const update = (scene, time) => {
      frames.total++
      if (!field.value) return
      nealestCheckable.value = field.value.charas.concat(field.value.substances).map(v => v.ref.value).filter(v => v.checkable).findMin(v => v.distanceToPlayer)
    }
    const transition = (duration = 500, hold) => {
      hold = hold ?? duration.half
      const start = () => new Promise(resolve => {
        const onComplete = () => sleep(hold.half).then(resolve)
        transitionAlpha.value = 0
        refs.scene.value.add.tween({ targets: transitionAlpha, duration, value: 1, onComplete })
      })
      const complete = () => new Promise(resolve => {
        sleep(hold.half).then(() => {
          refs.scene.value.add.tween({ targets: transitionAlpha, duration, value: 0, onComplete: resolve })
        })
      })
      return start().then(() => complete)
    }
    return {
      state: storage.state,
      mobile,
      config,
      update,
      ...refs,
      titleScreen,
      transition,
      transitionAlpha,
      nealestCheckable,
      selector, setSelector,
      screenMessage, setScreenMessage,
      check: () => {
        if (!nealestCheckable.value) return
        nealestCheckable.value.execTapEvent()
      }
    }
  }
}
</script>

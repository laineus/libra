<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @create="create" @update="update">
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
import config from '@/data/config'
export default {
  components: { Scene, Title, Controller, Rectangle, Circle, Image, Talk, Selector, Menu, Log },
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
    const create = (scene, payload) => {
    }
    const update = (scene, time) => {
      frames.total++
      if (!field.value) return
      nealestCheckable.value = field.value.charas.concat(field.value.substances).map(v => v.ref.value).filter(v => v.checkable).findMin(v => v.distanceToPlayer)
    }
    const transition = (duration = 500) => {
      return new Promise(onYoyo => {
        const promiseOnComplete = new Promise(onComplete => {
          transitionAlpha.value = 0
          refs.scene.value.add.tween({ targets: transitionAlpha, duration, hold: duration.half, value: 1, yoyo: true, onYoyo: () => onYoyo(() => promiseOnComplete), onComplete })
        })
      })
    }
    return {
      state: storage.state,
      mobile,
      config,
      create, update,
      ...refs,
      titleScreen,
      transition,
      transitionAlpha,
      nealestCheckable,
      selector, setSelector,
      check: () => {
        if (!nealestCheckable.value) return
        nealestCheckable.value.execTapEvent()
      }
    }
  }
}
</script>

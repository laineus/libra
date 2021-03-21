<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @update="update">
    <Title @close="titleScreen = false" v-if="titleScreen" />
    <template v-else>
      <Controller ref="controller" />
      <Container v-if="mobile" :x="player?.gun.mode.value ? (175).byRight : (70).byRight" :y="(140).byBottom">
        <Circle :radius="50" :fillColor="0x000000" :alpha="0.5" @pointerdown="player?.gunSwitch()" />
        <Image v-if="player?.gun.mode.value" texture="cancel" :alpha="0.3" />
        <Image v-else texture="gun" :alpha="0.3" :x="-4" :y="4" />
      </Container>
      <Container v-if="mobile && player?.gun.mode.value" :x="(70).byRight" :y="(190).byBottom">
        <Circle :radius="50" :fillColor="0x000000" :alpha="0.5" @pointerdown="player?.shot()" />
        <Image texture="shot" :alpha="0.3" />
      </Container>
      <Talk ref="talk" />
      <Selector v-if="selector.list" :x="selector.x" :y="selector.y" :list="selector.list" @select="selector.resolver" />
      <Log ref="log" />
      <Menu ref="menu" />
      <Image v-for="v in 5" :key="v" texture="hp" :frame="Math.round(state.status.hp / 20) >= v ? 0 : 1" :x="32 + ((v - 1) * 42)" :y="27" />
      <Container :x="config.WIDTH.half" :y="50" v-if="mapName">
        <RoundRectangle :tween="{ width: 166, alpha: 1, duration: 300, yoyo: true, hold: 3000 }" :width="10" :height="32" :alpha="0" :origin="0.5" :radius="5" :fillColor="config.COLORS.brown" />
        <RoundRectangle :tween="{ width: 161, alpha: 1, duration: 300, yoyo: true, hold: 3000 }" :width="5" :height="27" :alpha="0" :origin="0.5" :radius="5" :strokeColor="config.COLORS.soy" :lineWidth="1" />
        <Text :tween="{ alpha: 1, duration: 300, yoyo: true, hold: 3000, onComplete: () => setMapName(null) }" :alpha="0" :text="mapName" :origin="0.5" color="soy" :bold="true" />
      </Container>
    </template>
    <Transitions ref="transitions" />
    <Tutorial v-if="tutorial" :name="tutorial" @close="tutorial = null" />
    <Text v-if="screenMessage.text" :text="screenMessage.text" :tween="screenMessage.tween" :x="config.WIDTH.half" :y="config.HEIGHT.half" :size="17" :color="screenMessage.color" :origin="0.5" :depth="config.DEPTH.TRANSITION" />
    <Credit v-if="credit.resolve" :depth="config.DEPTH.TRANSITION" :endA="credit.endA" @completed="credit.resolve" />
    <Opening v-if="opening" :depth="config.DEPTH.TRANSITION" @unlock="opening" @completed="opening = null" />
  </Scene>
</template>

<script>
import { inject, onMounted, reactive, ref, shallowReactive } from 'vue'
import { refScene, Scene, Circle, Image, Container, RoundRectangle } from 'phavuer'
import dayjs from 'dayjs'
import Title from './Title'
import Controller from './Controller'
import Talk from './Talk'
import Selector from './Selector'
import Menu from './Menu'
import Log from './Log'
import Text from './Text'
import Transitions from './Transitions'
import Tutorial from '@/components/Tutorial'
import Credit from '@/components/Credit'
import Opening from '@/components/Opening'
import config from '@/data/config'
const downloadBySource = (src, name) => {
  const link = document.createElement('a')
  link.href = src
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export default {
  components: { Scene, Title, Controller, Circle, Image, Container, RoundRectangle, Talk, Selector, Menu, Log, Text, Transitions, Tutorial, Credit, Opening },
  setup (props) {
    const mobile = inject('mobile')
    const frames = inject('frames')
    const storage = inject('storage')
    const camera = inject('camera')
    const player = inject('player')
    const refs = {
      scene: refScene(null),
      controller: ref(null),
      talk: ref(null),
      log: ref(null),
      menu: ref(null),
      transitions: ref(null)
    }
    const tutorial = ref(null)
    const setTutorial = key => {
      if (storage.state.tutorial.includes(key)) return
      storage.state.tutorial.push(key)
      tutorial.value = key
    }
    onMounted(() => {
      refs.scene.value.input.setTopOnly(false)
      refs.scene.value.input.keyboard.on('keydown-S', e => {
        if (!e.shiftKey) return
        const filename = `ScreenShot_${dayjs().format('YYYYMMDD_HHmmss')}.png`
        refs.scene.value.game.renderer.snapshot(img => downloadBySource(img.src, filename))
      })
    })
    const titleScreen = ref(true)
    const credit = reactive({ endA: false, resolve: null })
    const startCredit = endA => {
      return new Promise(resolve => {
        credit.endA = endA
        credit.resolve = () => {
          sleep(200).then(() => credit.resolve = null)
          resolve()
        }
      })
    }
    const opening = ref(null)
    const startOpening = () => {
      return new Promise(resolve => {
        opening.value = resolve
      })
    }
    const screenMessage = shallowReactive({ text: null, color: null, tween: null })
    const setScreenMessage = (text, color = 'white') => {
      return new Promise(resolve => {
        const clear = () => {
          return new Promise(resolve => {
            const onComplete = () => {
              screenMessage.text = null
              resolve()
            }
            screenMessage.tween = { alpha: { from: 1, to: 0 }, duration: 300, onComplete }
          })
        }
        screenMessage.text = text
        screenMessage.color = color
        screenMessage.tween = { alpha: { from: 0, to: 1 }, duration: 300, onComplete: resolve(clear) }
      })
    }
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
    }
    const mapName = ref(null)
    const setMapName = name => {
      mapName.value = name
    }
    return {
      state: storage.state,
      mobile,
      config,
      update,
      ...refs,
      titleScreen,
      credit, startCredit,
      opening, startOpening,
      selector, setSelector,
      screenMessage, setScreenMessage,
      mapName, setMapName,
      tutorial, setTutorial,
      transition: (...args) => refs.transitions.value.add(...args),
      player
    }
  }
}
</script>

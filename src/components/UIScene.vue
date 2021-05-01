<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @update="update">
    <Title @close="titleScreen = false" v-if="titleScreen" />
    <template v-else>
      <Controller ref="controller" />
      <template v-if="mobile && !event.state">
        <Container v-if="nearestGrabbable" :x="(70).byRight" :y="(125).byBottom">
          <Circle :radius="40" :fillColor="0x000000" :alpha="0.5" @pointerdown="p => nearestGrabbable.execGrabEvent(p)" />
          <Image texture="hand" :alpha="0.3" :scale="0.8" />
        </Container>
        <Container v-if="nearestCheckable" :x="(165).byRight" :y="(125).byBottom">
          <Circle :radius="40" :fillColor="0x000000" :alpha="0.5" @pointerdown="() => nearestCheckable.execTapEvent()" />
          <Image texture="talk" :alpha="0.3" :scale="0.8" />
        </Container>
        <Container v-if="player?.hasGun" :x="(70).byRight" :y="(player?.gun.mode.value ? 125 : 220).byBottom">
          <Circle :radius="40" :fillColor="0x000000" :alpha="0.5" @pointerdown="player?.gunSwitch()" />
          <Image v-if="player?.gun.mode.value" texture="cancel" :alpha="0.3" :scale="0.8" />
          <Image v-else texture="gun" :alpha="0.3" :x="-4" :y="4" :scale="0.8" />
        </Container>
        <Container v-if="player?.hasGun && player?.gun.mode.value" :x="(70).byRight" :y="(220).byBottom">
          <Circle :radius="40" :fillColor="0x000000" :alpha="0.5" @pointerdown="player?.shot()" />
          <Image texture="shot" :alpha="0.3" :scale="0.8" />
        </Container>
      </template>
      <Talk ref="talk" />
      <Selector v-if="selector.list" :x="selector.x" :y="selector.y" :list="selector.list" @select="selector.resolver" />
      <Log ref="log" />
      <Menu ref="menu" />
      <Image v-for="v in 5" :key="v" texture="hp" :frame="Math.round(state.status.hp / 20) >= v ? 0 : 1" :x="32 + ((v - 1) * 42)" :y="27" />
      <Container :x="config.WIDTH.half" :y="55" v-if="mapName">
        <Image texture="menu_label" :tween="{ scaleX: 1.1, alpha: 1, duration: 300, yoyo: true, hold: 3000 }" :origin="0.5" :scaleX="0.2" :scaleY="1" :alpha="0" />
        <Text :tween="{ alpha: 1, duration: 300, yoyo: true, hold: 3000, onComplete: () => setMapName(null) }" :alpha="0" :text="mapName" :origin="0.5" color="soy" :bold="true" />
      </Container>
    </template>
    <Transitions ref="transitions" />
    <Tutorial v-if="tutorial" :name="tutorial" @close="tutorial = null" />
    <Text v-if="screenMessage.text" :text="screenMessage.text" :tween="screenMessage.tween" :x="config.WIDTH.half" :y="config.HEIGHT.half" :size="adjustFontSize(17)" :color="screenMessage.color" :origin="0.5" :depth="config.DEPTH.TRANSITION" />
    <Credit v-if="credit.resolve" :depth="config.DEPTH.TRANSITION" :endA="credit.endA" @completed="credit.resolve" />
    <Opening v-if="opening" :depth="config.DEPTH.TRANSITION" @unlock="opening" @completed="opening = null" />
    <Image v-for="(image, i) in images" :key="i" :texture="image.texture" :x="image.x" :y="image.y" :depth="image.depth" />
  </Scene>
</template>

<script>
import { computed, inject, onMounted, reactive, ref, shallowReactive } from 'vue'
import { refScene, Scene, Circle, Image, Container } from 'phavuer'
import dayjs from 'dayjs'
import adjustFontSize from '@/util/adjustFontSize'
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
  components: { Scene, Title, Controller, Circle, Image, Container, Talk, Selector, Menu, Log, Text, Transitions, Tutorial, Credit, Opening },
  setup (props) {
    const mobile = inject('mobile')
    const frames = inject('frames')
    const storage = inject('storage')
    const camera = inject('camera')
    const player = inject('player')
    const field = inject('field')
    const event = inject('event')
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
    const nearestCheckable = computed(() => {
      return field.value?.objects.map(v => v.ref.value).filter(v => v?.checkable).findMin(v => v.distanceToPlayer)
    })
    const nearestGrabbable = computed(() => {
      return field.value?.objects.map(v => v.ref.value).filter(v => v?.grabbable).findMin(v => v.distanceToPlayer)
    })
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
        selector.y = player.value?.object.y - camera.value?.scrollY - 65
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
      adjustFontSize,
      state: storage.state,
      nearestCheckable, nearestGrabbable,
      event,
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
      player,
      images: shallowReactive([])
    }
  }
}
</script>

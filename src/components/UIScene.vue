<template>
  <Scene ref="scene" name="UIScene" :autoStart="true" @update="update">
    <Controller ref="controller" :virtualStickEnabled="!titleScreen" @confirm="confirm" @cancel="cancel" @navigate="navigate" @grabstart="grabStart" @grabend="grabEnd" @bag="toggleMenu('bag')" @map="toggleMenu('map')" @system="toggleMenu('system')" @menuleft="shiftMenu(-1)" @menuright="shiftMenu(1)" />
    <Title ref="title" @close="titleScreen = false" v-if="titleScreen" />
    <template v-else>
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
      <Selector v-if="selector.list" :x="selector.x" :y="selector.y" :list="selector.list" :selectedIndex="gamepadMode ? selector.index : null" @select="selector.resolver" />
      <Log ref="log" />
      <Menu ref="menu" />
      <Image v-for="v in 5" :key="v" texture="hp" :frame="Math.round(storage.state.status.hp / 20) >= v ? 0 : 1" :x="32 + ((v - 1) * 42)" :y="27" />
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
    <Debug v-if="debug" />
  </Scene>
</template>

<script>
import { computed, inject, onMounted, reactive, ref, shallowReactive } from 'vue'
import { refPhaserInstance, Scene, Circle, Image, Container } from 'phavuer'
import dayjs from 'dayjs'
import adjustFontSize from '@/util/adjustFontSize'
import Title from './Title.vue'
import Controller from './Controller.vue'
import Talk from './Talk.vue'
import Selector from './Selector.vue'
import Menu from './Menu.vue'
import Log from './Log.vue'
import Text from './Text.vue'
import Transitions from './Transitions.vue'
import Tutorial from '@/components/Tutorial.vue'
import Credit from '@/components/Credit.vue'
import Opening from '@/components/Opening.vue'
import Debug from '@/components/Debug.vue'
import config from '@/data/config'
const GAMEPAD_GRAB_SPEED = 500
const downloadBySource = (src, name) => {
  const link = document.createElement('a')
  link.href = src
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
export default {
  components: { Scene, Title, Controller, Circle, Image, Container, Talk, Selector, Menu, Log, Text, Transitions, Tutorial, Credit, Opening, Debug },
  setup (props) {
    const mobile = inject('mobile')
    const frames = inject('frames')
    const storage = inject('storage')
    const camera = inject('camera')
    const player = inject('player')
    const field = inject('field')
    const event = inject('event')
    const refs = {
      scene: refPhaserInstance(null),
      title: ref(null),
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
    const nearestCheckable = computed(() => field.value?.nearestCheckable)
    const nearestGrabbable = computed(() => field.value?.nearestGrabbable)
    const debug = ref(false)
    const gamepadMode = computed(() => refs.controller.value?.gamepadMode)
    const confirm = () => {
      if (titleScreen.value) return refs.title.value?.confirm()
      if (selector.list) {
        if (selector.index !== null) selector.resolver(selector.index)
        return
      }
      if (refs.talk.value?.current) return refs.talk.value.next()
      if (refs.menu.value?.selected) return refs.menu.value.confirm()
      if (!event.state) nearestCheckable.value?.execTapEvent()
    }
    const toggleMenu = name => {
      if (titleScreen.value) return
      if (!event.state) refs.menu.value?.toggle(name)
    }
    const cancel = () => titleScreen.value ? refs.title.value?.cancel() : refs.menu.value?.cancel()
    const navigate = direction => {
      if (titleScreen.value) return refs.title.value?.navigate(direction)
      if (selector.list) {
        if (direction.y && selector.index === null) {
          selector.index = direction.y < 0 ? 0 : Math.min(1, selector.list.length - 1)
        } else if (direction.y) {
          selector.index = (selector.index + direction.y + selector.list.length) % selector.list.length
        }
        return
      }
      refs.menu.value?.navigate(direction)
    }
    const shiftMenu = direction => {
      if (!titleScreen.value) refs.menu.value?.shift(direction)
    }
    let grabPointer = null
    const grabStart = () => {
      if (titleScreen.value) return refs.title.value?.confirm()
      if (selector.list) {
        if (selector.index !== null) selector.resolver(selector.index)
        return
      }
      const target = nearestGrabbable.value
      if (refs.menu.value?.selected) return refs.menu.value.grab()
      if (!target || event.state) return
      const x = target.object.x - camera.value.scrollX
      const y = target.object.y - camera.value.scrollY
      grabPointer = {
        active: true,
        isDown: true,
        button: 0,
        x,
        y,
        worldX: target.object.x,
        worldY: target.object.y
      }
      target.execGrabEvent(grabPointer)
    }
    const grabEnd = () => {
      refs.menu.value?.grabEnd()
      if (!grabPointer) return
      grabPointer.isDown = false
      grabPointer = null
    }
    onMounted(() => {
      refs.scene.value.input.setTopOnly(false)
      refs.scene.value.input.keyboard.on('keydown-F12', (e) => {
        e.preventDefault()
        const filename = `ScreenShot_${dayjs().format('YYYYMMDD_HHmmss')}.png`
        refs.scene.value.game.renderer.snapshot(img => downloadBySource(img.src, filename))
      })
      refs.scene.value.input.keyboard.on('keydown-F9', (e) => {
        e.preventDefault()
        if (e.ctrlKey) debug.value = !debug.value
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
    const selector = reactive({ list: null, resolver: null, index: null, x: 0, y: 0 })
    const setSelector = list => {
      return new Promise(resolve => {
        selector.list = list
        selector.index = null
        selector.x = player.value?.object.x - camera.value?.scrollX
        selector.y = player.value?.object.y - camera.value?.scrollY - 65
        selector.resolver = result => {
          selector.list = null
          selector.resolver = null
          resolve(result)
        }
      })
    }
    const update = (scene, time, delta) => {
      frames.total++
      if (!grabPointer) return
      const controller = refs.controller.value
      grabPointer.x = Math.fix(grabPointer.x + controller.rightStickX * GAMEPAD_GRAB_SPEED * delta / 1000, 0, config.WIDTH)
      grabPointer.y = Math.fix(grabPointer.y + controller.rightStickY * GAMEPAD_GRAB_SPEED * delta / 1000, 0, config.HEIGHT)
      grabPointer.worldX = grabPointer.x + camera.value.scrollX
      grabPointer.worldY = grabPointer.y + camera.value.scrollY
    }
    const mapName = ref(null)
    const setMapName = name => {
      mapName.value = name
    }
    return {
      adjustFontSize,
      storage,
      nearestCheckable, nearestGrabbable,
      event,
      mobile,
      config,
      gamepadMode,
      confirm,
      toggleMenu, cancel, navigate, shiftMenu,
      grabStart, grabEnd,
      update,
      ...refs,
      debug,
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

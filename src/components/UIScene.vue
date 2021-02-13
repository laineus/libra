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
      <Container :x="config.WIDTH.half" :y="50" v-if="mapName">
        <RoundRectangle :tween="{ width: 166, alpha: 1, duration: 300, yoyo: true, hold: 3000 }" :width="10" :height="32" :alpha="0" :origin="0.5" :radius="5" :fillColor="config.COLORS.brown" />
        <RoundRectangle :tween="{ width: 161, alpha: 1, duration: 300, yoyo: true, hold: 3000 }" :width="5" :height="27" :alpha="0" :origin="0.5" :radius="5" :strokeColor="config.COLORS.soy" :lineWidth="1" />
        <Text :tween="{ alpha: 1, duration: 300, yoyo: true, hold: 3000, onComplete: () => setMapName(null) }" :alpha="0" :text="mapName" :origin="0.5" color="soy" :bold="true" />
      </Container>
    </template>
    <Rectangle v-for="v in transitions" :key="v.id" :fillColor="v.color" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="config.DEPTH.TRANSITION" :alpha="v.alpha" />
    <Text v-if="screenMessage" :text="screenMessage" :x="config.WIDTH.half" :y="config.HEIGHT.half" :size="17" color="white" :origin="0.5" :depth="config.DEPTH.TRANSITION" />
  </Scene>
</template>

<script>
import { inject, onMounted, reactive, ref, shallowReactive } from 'vue'
import { refScene, Scene, Rectangle, Circle, Image, Container, RoundRectangle } from 'phavuer'
import Title from './Title'
import Controller from './Controller'
import Talk from './Talk'
import Selector from './Selector'
import Menu from './Menu'
import Log from './Log'
import Text from './Text'
import config from '@/data/config'
export default {
  components: { Scene, Title, Controller, Rectangle, Circle, Image, Container, RoundRectangle, Talk, Selector, Menu, Log, Text },
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
    onMounted(() => {
      refs.scene.value.input.setTopOnly(false)
    })
    const titleScreen = ref(true)
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
    const transitions = shallowReactive([])
    const getTransitionTween = target => (duration, { alpha, hold, destroy }) => {
      return new Promise(resolve => {
        const onComplete = () => {
          if (destroy) transitions.delete(target)
          sleep(hold).then(resolve)
        }
        return refs.scene.value.add.tween({ targets: target, duration, alpha, onComplete })
      })
    }
    const transition = (duration = 500, { color = config.COLORS.black, alpha = 1, hold } = {}) => {
      hold = hold ?? duration.half
      const data = shallowReactive({ id: Symbol('id'), color, alpha: 0 })
      transitions.push(data)
      const tween = getTransitionTween(data)
      return tween(duration, { alpha, hold, destroy: false }).then(() => {
        const nextTween = (...args) => tween(args[0] ?? duration, Object.assign({ alpha: 0, hold: 0, destroy: true }, args[1])).then(() => nextTween)
        return nextTween
      })
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
      transition,
      transitions,
      nealestCheckable,
      selector, setSelector,
      screenMessage, setScreenMessage,
      mapName, setMapName,
      check: () => {
        if (!nealestCheckable.value) return
        nealestCheckable.value.execTapEvent()
      }
    }
  }
}
</script>

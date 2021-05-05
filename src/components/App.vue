<template>
  <div>
    <BootScene ref="bootScene" @create="loaded = true" v-if="!loaded" />
    <template v-else>
      <GameScene ref="gameScene" />
      <UIScene ref="uiScene" />
      <Debug v-if="env === 'development'" />
    </template>
  </div>
</template>

<script>
import BootScene from '@/components/BootScene'
import GameScene from '@/components/GameScene'
import UIScene from '@/components/UIScene'
import Debug from '@/components/Debug'
import AudioController from '@/class/AudioController'
import SaveDataManager from '@/class/SaveDataManager'
import AchieveManager from '@/class/AchieveManager'
import setting from '@/data/setting'
import { inject, provide, ref, computed, reactive } from 'vue'
export default {
  components: { BootScene, GameScene, UIScene, Debug },
  setup () {
    const game = inject('game')
    Phaser.BlendModes.OVERLAY = game.renderer.addBlendMode([WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE], WebGLRenderingContext.FUNC_ADD)
    const gameScene = ref(null)
    const uiScene = ref(null)
    const loaded = ref(false)
    const eventManager = reactive({
      state: false,
      setState (bool) {
        eventManager.state = bool
      },
      exec (event, options) {
        eventManager.setState(true)
        if (options?.closeMenu !== false) uiScene.value?.menu.close()
        gameScene.value?.field?.player.stopWalking()
        const promise = event()
        if (!promise || typeof promise.then !== 'function') throw new Error('Event must returns Promise instance')
        return promise.then(result => {
          eventManager.setState(false)
          return result
        })
      }
    })
    const frames = reactive({ total: 0, game: 0 })
    const sdm = new SaveDataManager()
    const achieve = new AchieveManager()
    if (typeof greenworks !== 'undefined') {
      try {
        greenworks.init()
        sdm.initSteam(greenworks)
        achieve.initSteam(greenworks)
      } catch (e) {
        alert(e)
      }
    }
    setInterval(() => sdm.state.sec++, 1000)
    provide('event', eventManager)
    provide('frames', frames)
    provide('gameScene', gameScene)
    provide('field', computed(() => gameScene.value?.field))
    provide('camera', computed(() => gameScene.value?.scene.cameras.main))
    provide('player', computed(() => gameScene.value?.field?.player))
    provide('uiScene', uiScene)
    provide('menu', computed(() => uiScene.value?.menu))
    provide('menuOpened', computed(() => uiScene.value?.menu.selected))
    provide('controller', computed(() => uiScene.value?.controller))
    provide('talk', computed(() => uiScene.value?.talk))
    provide('mobile', !game.device.os.desktop)
    provide('audio', new AudioController(game.sound, setting.state.bgm, setting.state.se))
    provide('storage', sdm)
    provide('achieve', achieve)
    provide('setting', setting)
    provide('bag', {
      hasItem: (key, count = 1, { bag = false, room = false, field = false } = { bag: true }) => {
        return [].concat(
          bag ? sdm.state.bagItems.map(v => v.key) : [],
          room ? sdm.state.roomItems.map(v => v.key) : [],
          field ? gameScene.value?.field.objects.map(v => v.name) : []
        ).count(v => v === key) >= count
      },
      removeItem: (key, count = 1) => count.toArray().forEach(() => sdm.state.bagItems.delete(v => v.key === key))
    })
    return {
      env: ENV,
      loaded,
      gameScene, uiScene
    }
  }
}
</script>

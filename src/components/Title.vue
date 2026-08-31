<template>
  <Image texture="main" :x="config.WIDTH.half" :y="config.HEIGHT.half" />
  <Text :text="`Version: ${appVersion}`" :size="11" color="soy" :origin="1" :x="config.WIDTH - 80" :y="config.HEIGHT - 35" />
  <Container>
    <Image v-if="setting.state.lang === 'ja'" texture="logo_ja" :x="config.WIDTH.half" :y="config.HEIGHT.half - 77" />
    <Image v-else-if="setting.state.lang === 'cn'" texture="logo_cn" :x="config.WIDTH.half" :y="config.HEIGHT.half - 77" />
    <Image v-else-if="setting.state.lang === 'es'" texture="logo_es" :x="config.WIDTH.half" :y="config.HEIGHT.half - 80" />
    <Image v-else texture="logo_en" :x="config.WIDTH.half" :y="config.HEIGHT.half - 90" />
  </Container>
  <Container v-for="(v, i) in list" :key="i" :x="config.WIDTH.half" :y="380 + (i * 40)">
    <Image texture="nav" :frame="i" :blendMode="Phaser.BlendModes.ADD" :alpha="selected === i || (gamepadMode && selected === null && cursorIndex === i) ? 1 : gamepadMode ? 0.55 : 0.87" @pointerdown.stop="select(i)" />
    <Text :text="t(`ui.${v}`).split('').join(' ')" :size="13" :origin="0.5" :bold="true" :style="{ shadow: { offsetX: 0, offsetY: 1, blur: 1, color: '#00000020', fill: true } }" />
  </Container>
  <Container v-if="selected > 0" :tween="tween">
    <Rectangle :fillColor="config.COLORS.black" :origin="0" :alpha="0.5" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="select(null)" />
    <OrganicWindow v-if="selected === 1" :x="config.WIDTH.half" :y="340" :width="250" :height="275" @pointerdown.stop>
      <menu-system-save ref="saveMenu" v-if="selected === 1" :x="-120" :y="-128" :load="true" @load="$emit('close')" />
    </OrganicWindow>
    <OrganicWindow v-else-if="selected === 2" :x="config.WIDTH.half" :y="355" :width="250" :height="230" @pointerdown.stop>
      <menu-system-config ref="configMenu" :controllerActive="!configOk" :x="-120" :y="-108" :backToTitle="false" />
      <Rectangle :width="101" :height="23" :origin="0.5" :radius="7" :strokeColor="configOk && gamepadMode ? config.COLORS.orange : config.COLORS.brown" :lineWidth="configOk && gamepadMode ? 2 : 1" :fillColor="config.COLORS.brown" :fillAlpha="configOk && gamepadMode ? 1 : 0" :y="92" @pointerdown="select(null)" />
      <Text :text="t('ui.ok')" :origin="0.5" :y="92" :size="14" :color="configOk && gamepadMode ? 'soy' : undefined" />
    </OrganicWindow>
  </Container>
  <template v-if="!creditEnd">
    <Rectangle :fillColor="0x111111" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :tween="bgTween" @pointerdown.stop="skipCredit" />
    <Image texture="logo_laineus" :x="config.WIDTH.half" :y="config.HEIGHT.half" :tween="logoTween" />
  </template>
</template>

<script>
import * as Phaser from 'phaser'
import { computed, inject, ref } from 'vue'
import { Rectangle, Image, Container } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text.vue'
import MenuSystemSave from '@/components/MenuSystemSave.vue'
import MenuSystemConfig from '@/components/MenuSystemConfig.vue'
import OrganicWindow from '@/components/OrganicWindow.vue'
import packageJson from '../../package.json'
export default {
  components: { Rectangle, Text, Image, Container, MenuSystemSave, MenuSystemConfig, OrganicWindow },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene')
    const storage = inject('storage')
    const setting = inject('setting')
    const audio = inject('audio')
    const controller = inject('controller')
    const saveMenu = ref(null)
    const configMenu = ref(null)
    const selected = ref(null)
    const cursorIndex = ref(0)
    const configOk = ref(false)
    let cursorMoved = false
    storage.getList().then(rows => {
      if (!cursorMoved && rows.some(row => row.exists)) cursorIndex.value = 1
    })
    const list = ['newGame', 'continue', 'config']
    const tween = ref(null)
    const select = async i => {
      if (i === null) {
        audio.se('cancel')
        tween.value = { alpha: { from: 1, to: 0 }, duration: 70, onComplete: () => selected.value = null }
      } else if (i === 0) {
        audio.se('click')
        selected.value = 0
        storage.init()
        await gameScene.value.setField('forest2', (12).toPixelCenter, (23).toPixelCenter, -Math.PI.half, { autosave: false })
        context.emit('close')
      } else {
        audio.se('click')
        selected.value = i
        configOk.value = false
        tween.value = { alpha: { from: 0, to: 1 }, duration: 70 }
      }
    }
    const navigate = direction => {
      if (!creditEnd.value) return
      if (selected.value === null) {
        if (direction.y) {
          cursorMoved = true
          cursorIndex.value = Math.fix(cursorIndex.value + direction.y, 0, list.length - 1)
        }
        return
      }
      if (selected.value === 1) return saveMenu.value?.navigate(direction)
      if (selected.value !== 2) return
      if (configOk.value) {
        if (direction.y < 0) {
          configOk.value = false
          configMenu.value?.focusLast()
        }
        return
      }
      if (configMenu.value?.navigate(direction) === 'footer') configOk.value = true
    }
    const confirm = () => {
      if (!creditEnd.value) return skipCredit()
      if (selected.value === null) return select(cursorIndex.value)
      if (selected.value === 1) return saveMenu.value?.confirm()
      if (selected.value === 2) {
        if (configOk.value) return select(null)
        return configMenu.value?.confirm()
      }
    }
    const cancel = () => {
      if (!creditEnd.value) return skipCredit()
      if (selected.value === null) return
      const child = selected.value === 1 ? saveMenu.value : configMenu.value
      if (child?.cancel?.()) return
      select(null)
    }
    const creditEnd = ref(false)
    const bgTween = ref(null)
    const logoTween = {
      duration: 250,
      hold: 1600,
      alpha: { from: 0, to: 1 },
      yoyo: true,
      onComplete: () => {
        audio.setBgm('happy')
        bgTween.value = {
          delay: 300,
          duration: 1000,
          alpha: 0,
          onComplete: () => {
            creditEnd.value = true
          }
        }
      }
    }
    audio.setBgm(null)
    const skipCredit = () => {
      audio.setBgm('happy')
      creditEnd.value = true
    }
    const appVersion = packageJson.version
    return {
      appVersion,
      t,
      Phaser,
      config,
      setting,
      selected,
      cursorIndex,
      configOk,
      gamepadMode: computed(() => controller.value?.gamepadMode),
      saveMenu, configMenu,
      tween,
      list,
      select,
      navigate, confirm, cancel,
      creditEnd,
      bgTween,
      logoTween,
      skipCredit
    }
  }
}
</script>

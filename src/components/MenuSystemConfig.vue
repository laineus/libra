<template>
  <Container>
    <!-- BGM -->
    <Rectangle v-if="gamepadMode && focusIndex === 0" :x="120" :y="30" :width="226" :height="42" :fillColor="COLORS.orange" :alpha="0.8" :depth="-1" />
    <Text :text="t('ui.bgmVolume')" :x="11" :y="14" :size="14" :bold="true" />
    <Text :text="`${setting.state.bgm}%`" :x="227" :y="14" :originX="1" :size="14" />
    <Slider :x="11" :y="38" :width="217" :height="9" :max="100" :bgColor="COLORS.soy" v-model="model.bgm" @commit="commit" />
    <!-- SE -->
    <Rectangle v-if="gamepadMode && focusIndex === 1" :x="120" :y="75" :width="226" :height="42" :fillColor="COLORS.orange" :alpha="0.8" :depth="-1" />
    <Text :text="t('ui.seVolume')" :x="11" :y="59" :size="14" :bold="true" />
    <Text :text="`${setting.state.se}%`" :x="227" :y="59" :originX="1" :size="14" />
    <Slider :x="11" :y="83" :width="217" :height="9" :max="100" :bgColor="COLORS.soy" v-model="model.se" @commit="commit" />
    <!-- LANG -->
    <Text text="Language" :x="11" :y="105" :size="14" :bold="true" /><!-- Must not be translated -->

    <Rectangle v-if="gamepadMode && focusIndex === 2" :x="45" :y="137" :width="82" :height="22" :fillColor="COLORS.orange" :alpha="0.8" :depth="-1" />
    <Rectangle v-if="gamepadMode && focusIndex === 3" :x="130" :y="137" :width="82" :height="22" :fillColor="COLORS.orange" :alpha="0.8" :depth="-1" />
    <Rectangle v-if="gamepadMode && focusIndex === 4" :x="45" :y="160" :width="82" :height="22" :fillColor="COLORS.orange" :alpha="0.8" :depth="-1" />
    <Rectangle v-if="gamepadMode && focusIndex === 5" :x="130" :y="160" :width="82" :height="22" :fillColor="COLORS.orange" :alpha="0.8" :depth="-1" />

    <Circle :x="18" :y="137" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('en')" />
    <Circle v-if="setting.state.lang === 'en'" :x="18" :y="137" :fillColor="COLORS.brown" :radius="4" />
    <Text text="English" :x="31" :y="137" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('en')" />

    <Circle :x="100" :y="137" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('es')" />
    <Circle v-if="setting.state.lang === 'es'" :x="100" :y="137" :fillColor="COLORS.brown" :radius="4" />
    <Text text="Español" :x="113" :y="137" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('es')" />

    <Circle :x="18" :y="160" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('ja')" />
    <Circle v-if="setting.state.lang === 'ja'" :x="18" :y="160" :fillColor="COLORS.brown" :radius="4" />
    <Text text="日本語" :x="31" :y="160" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('ja')" />

    <Circle :x="100" :y="160" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('cn')" />
    <Circle v-if="setting.state.lang === 'cn'" :x="100" :y="160" :fillColor="COLORS.brown" :radius="4" />
    <Text text="简体字" :x="113" :y="160" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('cn')" />

    <!-- Back to title -->
    <Rectangle v-if="gamepadMode && focusIndex === 6 && backToTitle" :x="180" :y="206" :width="110" :height="24" :fillColor="COLORS.orange" :alpha="0.8" :depth="-1" />
    <Text v-if="backToTitle" :text="'Back to Title →'" :x="230" :y="206" :originX="1" :originY="0.5" :size="13" :bold="true" @pointerdown="confirmBackToTitle" />
    <Selector v-if="confirming" :x="tapX" :y="tapY" :list="[t('ui.ok'), t('ui.cancel')]" :selectedIndex="gamepadMode ? optionIndex : null" @select="submitBackToTitle" />
  </Container>
</template>

<script>
import { computed, inject, reactive, toRefs } from 'vue'
import { Container, Circle, Rectangle } from 'phavuer'
import Text from '@/components/Text.vue'
import Slider from '@/components/Slider.vue'
import Selector from '@/components/Selector.vue'
import config from '@/data/config'
export default {
  components: { Container, Text, Slider, Circle, Rectangle, Selector },
  props: {
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
    backToTitle: { type: Boolean, default: true },
    controllerActive: { type: Boolean, default: true }
  },
  setup (props) {
    const setting = inject('setting')
    const audio = inject('audio')
    const controller = inject('controller')
    const gameScene = inject('gameScene').value
    const data = reactive({
      confirming: false,
      focusIndex: 0,
      optionIndex: 0,
      tapX: 0, tapY: 0
    })
    const confirmBackToTitle = pointer => {
      data.confirming = true
      data.tapX = pointer.x - props.offsetX
      data.tapY = pointer.y - props.offsetY - 13
    }
    const submitBackToTitle = i => {
      if (i === 1) {
        data.confirming = false
        return
      }
      gameScene.backToTitle()
    }
    const setLang = value => {
      setting.state.lang = value
      setting.save()
      audio.se('click')
    }
    const languageIndex = () => ({ en: 2, es: 3, ja: 4, cn: 5 })[setting.state.lang] ?? 2
    const adjustVolume = (key, direction) => {
      setting.state[key] = Math.fix(setting.state[key] + direction * 5, 0, 100)
      if (key === 'bgm') audio.setBgmVolume(setting.state.bgm)
      else audio.setSeVolume(setting.state.se)
      setting.save()
    }
    const navigate = ({ x, y }) => {
      if (data.confirming) {
        if (y) data.optionIndex = (data.optionIndex + y + 2) % 2
        return
      }
      if (data.focusIndex < 2 && x) return adjustVolume(data.focusIndex === 0 ? 'bgm' : 'se', x)
      if (data.focusIndex >= 2 && data.focusIndex <= 5 && x) {
        data.focusIndex += x > 0 ? (data.focusIndex % 2 === 0 ? 1 : 0) : (data.focusIndex % 2 === 1 ? -1 : 0)
        return
      }
      if (!y) return
      if (data.focusIndex === 0) {
        if (y < 0) return 'tabs'
        data.focusIndex = 1
      } else if (data.focusIndex === 1) {
        data.focusIndex = y < 0 ? 0 : languageIndex()
      } else if (data.focusIndex <= 3) {
        data.focusIndex = y < 0 ? 1 : data.focusIndex + 2
      } else if (y < 0) {
        data.focusIndex -= 2
      } else if (props.backToTitle) {
        data.focusIndex = 6
      }
    }
    const controllerConfirm = () => {
      if (data.confirming) return submitBackToTitle(data.optionIndex)
      if (data.focusIndex >= 2 && data.focusIndex <= 5) return setLang(['en', 'es', 'ja', 'cn'][data.focusIndex - 2])
      if (data.focusIndex === 6 && props.backToTitle) {
        data.confirming = true
        data.optionIndex = 0
        data.tapX = 230
        data.tapY = 193
      }
    }
    const cancel = () => {
      if (!data.confirming) return false
      data.confirming = false
      return true
    }
    return {
      t,
      COLORS: config.COLORS,
      ...toRefs(data),
      confirmBackToTitle,
      submitBackToTitle,
      setting,
      gamepadMode: computed(() => props.controllerActive && controller.value?.gamepadMode),
      setLang,
      navigate, confirm: controllerConfirm, cancel,
      model: {
        get bgm () {
          return setting.state.bgm
        },
        set bgm (v) {
          setting.state.bgm = Math.round(v)
        },
        get se () {
          return setting.state.se
        },
        set se (v) {
          setting.state.se = Math.round(v)
        }
      },
      commit () {
        audio.setBgmVolume(setting.state.bgm)
        audio.setSeVolume(setting.state.se)
        setting.save()
        audio.se('click')
      }
    }
  }
}
</script>

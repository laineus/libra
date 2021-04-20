<template>
  <Container>
    <!-- BGM -->
    <Text :text="t('ui.bgmVolume')" :x="11" :y="14" :size="14" :bold="true" />
    <Text :text="`${setting.state.bgm}%`" :x="227" :y="14" :originX="1" :size="14" />
    <Slider :x="11" :y="38" :width="217" :height="9" :max="100" :bgColor="COLORS.soy" v-model="model.bgm" @commit="commit" />
    <!-- SE -->
    <Text :text="t('ui.seVolume')" :x="11" :y="59" :size="14" :bold="true" />
    <Text :text="`${setting.state.se}%`" :x="227" :y="59" :originX="1" :size="14" />
    <Slider :x="11" :y="83" :width="217" :height="9" :max="100" :bgColor="COLORS.soy" v-model="model.se" @commit="commit" />
    <!-- LANG -->
    <Text text="Lang" :x="11" :y="105" :size="14" :bold="true" /><!-- Must not be translated -->
    <Circle :x="18" :y="136" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('ja')" />
    <Circle v-if="setting.state.lang === 'ja'" :x="18" :y="136" :fillColor="COLORS.brown" :radius="4" />
    <Text text="日本語" :x="31" :y="137" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('ja')" />
    <Circle :x="98" :y="136" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('en')" />
    <Circle v-if="setting.state.lang === 'en'" :x="98" :y="136" :fillColor="COLORS.brown" :radius="4" />
    <Text text="English" :x="111" :y="137" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('en')" />
    <!-- Back to title -->
    <Text v-if="backToTitle" :text="'Back to Title →'" :x="230" :y="186" :originX="1" :originY="0.5" :size="13" :bold="true" @pointerdown="confirmBackToTitle" />
    <Selector v-if="confirm" :x="tapX" :y="tapY" :list="[t('ui.ok'), t('ui.cancel')]" @select="submitBackToTitle" />
  </Container>
</template>

<script>
import { inject, reactive, toRefs } from 'vue'
import { Container, Circle } from 'phavuer'
import Text from '@/components/Text'
import Slider from '@/components/Slider'
import Selector from '@/components/Selector'
import config from '@/data/config'
export default {
  components: { Container, Text, Slider, Circle, Selector },
  props: {
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
    backToTitle: { type: Boolean, default: true }
  },
  setup (props) {
    const setting = inject('setting')
    const audio = inject('audio')
    const gameScene = inject('gameScene').value
    const data = reactive({
      confirm: false,
      tapX: 0, tapY: 0
    })
    const confirmBackToTitle = pointer => {
      data.confirm = true
      data.tapX = pointer.x - props.offsetX
      data.tapY = pointer.y - props.offsetY - 13
    }
    const submitBackToTitle = i => {
      if (i === 1) {
        data.confirm = false
        return
      }
      gameScene.backToTitle()
    }
    return {
      t,
      COLORS: config.COLORS,
      ...toRefs(data),
      confirmBackToTitle,
      submitBackToTitle,
      setting,
      setLang: v => {
        setting.state.lang = v
        setting.save()
        audio.se('click')
      },
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

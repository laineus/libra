<template>
  <Container>
    <!-- BGM -->
    <Text text="BGM" :x="6" :y="14" :size="14" :bold="true" />
    <Text :text="`${setting.state.bgm}%`" :x="212" :y="14" :originX="1" :size="14" />
    <Slider :x="6" :y="33" :width="207" :height="8" :max="100" :bgColor="COLORS.soy" v-model="model.bgm" @commit="setting.save()" />
    <!-- SE -->
    <Text text="SE" :x="6" :y="54" :size="14" :bold="true" />
    <Text :text="`${setting.state.se}%`" :x="212" :y="54" :originX="1" :size="14" />
    <Slider :x="6" :y="73" :width="207" :height="8" :max="100" :bgColor="COLORS.soy" v-model="model.se" @commit="setting.save()" />
    <!-- LANG -->
    <Text text="Lang" :x="6" :y="94" :size="14" :bold="true" />
    <Circle :x="13" :y="125" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('ja')" />
    <Circle v-if="setting.state.lang === 'ja'" :x="13" :y="125" :fillColor="COLORS.brown" :radius="4" />
    <Text text="日本語" :x="26" :y="126" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('ja')" />
    <Circle :x="93" :y="125" :lineWidth="1" :strokeColor="COLORS.brown" :radius="7" @pointerdown="setLang('en')" />
    <Circle v-if="setting.state.lang === 'en'" :x="93" :y="125" :fillColor="COLORS.brown" :radius="4" />
    <Text text="English" :x="106" :y="126" :originY="0.5" :size="13" :bold="true" @pointerdown="setLang('en')" />
  </Container>
</template>

<script>
import { inject } from 'vue'
import { Container, Circle } from 'phavuer'
import Text from '@/components/Text'
import Slider from '@/components/Slider'
import config from '@/data/config'
export default {
  components: { Container, Text, Slider, Circle },
  setup () {
    const setting = inject('setting')
    return {
      COLORS: config.COLORS,
      setting,
      setLang: v => {
        setting.state.lang = v
        setting.save()
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
      }
    }
  }
}
</script>

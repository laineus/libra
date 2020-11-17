<template>
  <Container>
    <!-- BGM -->
    <Text text="BGM" :x="6" :y="14" :style="{ fontSize: 14, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    <Text :text="`${setting.state.bgm}%`" :x="212" :y="14" :originX="1" :style="{ fontSize: 14, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    <Slider :x="6" :y="32" :width="207" :height="8" :max="100" :bgColor="COLORS.soy" v-model="model.bgm" @commit="setting.save()" />
    <!-- SE -->
    <Text text="SE" :x="6" :y="54" :style="{ fontSize: 14, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    <Text :text="`${setting.state.se}%`" :x="212" :y="54" :originX="1" :style="{ fontSize: 14, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    <Slider :x="6" :y="72" :width="207" :height="8" :max="100" :bgColor="COLORS.soy" v-model="model.se" @commit="setting.save()" />
  </Container>
</template>

<script>
import { inject } from 'vue'
import { Container, Text } from 'phavuer'
import Slider from '@/components/Slider'
import config from '@/data/config'
export default {
  components: { Container, Text, Slider },
  setup () {
    const setting = inject('setting')
    return {
      COLORS: config.COLORS,
      setting,
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

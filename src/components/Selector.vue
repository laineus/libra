<template>
  <SpeachBubble :width="bgWidth" :height="(bgHeight * options.length) + (2 * (options.length - 1))">
    <Container v-for="(v, i) in options" :key="i" :y="(bgHeight + 2) * i">
      <RoundRectangle :fillColor="COLORS.brown" :radius="4" :width="bgWidth" :height="bgHeight" @pointerdown="select(i)" />
      <Rectangle :fillColor="COLORS.soy" :x="10" :y="14" :width="3" :height="3" :rotation="Math.PI / 4" />
      <Text :ref="v.ref" :text="v.text" :style="{ fontSize: 14, fontStyle: 'normal', color: COLORS.soy.toColorString }" :x="18" :y="6" :lineSpacing="3" :padding="{ top: 2 }" />
    </Container>
  </SpeachBubble>
</template>

<script>
import { refObj, Container, RoundRectangle, Rectangle, Text } from 'phavuer'
import { reactive, toRefs, onMounted } from 'vue'
import SpeachBubble from './SpeachBubble'
import config from '@/data/config'
export default {
  components: { SpeachBubble, Container, RoundRectangle, Rectangle, Text },
  props: ['list'],
  emits: ['select'],
  setup (props, context) {
    // data
    const options = props.list.map(text => {
      return { ref: refObj(null), text }
    })
    const data = reactive({
      bgWidth: 0,
      bgHeight: 27
    })
    onMounted(() => {
      data.bgWidth = Math.max(...options.map(v => v.ref.value.width)) + 32
    })
    const select = (i) => {
      context.emit('select', i)
    }
    return {
      COLORS: config.COLORS,
      options,
      ...toRefs(data),
      select
    }
  }
}
</script>

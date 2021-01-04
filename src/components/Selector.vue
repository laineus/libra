<template>
  <SpeachBubble :width="bgWidth" :height="(bgHeight * options.length) + (2 * (options.length - 1))">
    <Container v-for="(v, i) in options" :key="i" :y="(bgHeight + 2) * i">
      <RoundRectangle :fillColor="COLORS.brown" :radius="4" :width="bgWidth" :height="bgHeight" @pointerdown="select($event, i)" />
      <Rectangle :fillColor="COLORS.soy" :x="10" :y="14" :width="3" :height="3" :rotation="Math.PI / 4" />
      <Text :ref="v.ref" :text="v.text" :size="14" color="soy" :x="18" :y="5" :lineSpacing="3" />
    </Container>
  </SpeachBubble>
</template>

<script>
import { refObj, Container, RoundRectangle, Rectangle } from 'phavuer'
import { reactive, toRefs, onMounted } from 'vue'
import config from '@/data/config'
import SpeachBubble from '@/components/SpeachBubble'
import Text from '@/components/Text'
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
    const select = (pointer, i) => {
      pointer.isDown = false
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

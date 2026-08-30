<template>
  <PhavuerText ref="phaserInstance" :style="mergedStyle" />
</template>

<script>
import { refPhaserInstance, Text } from 'phavuer'
import config from '@/data/config'
import { computed } from 'vue'
export default {
  components: { PhavuerText: Text },
  props: {
    size: { default: 15 },
    bold: { default: false },
    color: { default: 'brown' },
    style: { default: null }
  },
  setup (props) {
    const mergedStyle = computed(() => {
      return Object.assign({
        fontSize: props.size,
        fontStyle: props.bold ? 'bold' : 'normal',
        fontFamily: config.FONT,
        color: config.COLORS[props.color].toColorString
      }, props.style)
    })
    return {
      phaserInstance: refPhaserInstance(),
      mergedStyle
    }
  }
}
</script>

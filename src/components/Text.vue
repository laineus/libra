<template>
  <PhavuerText ref="object" :style="mergedStyle" />
</template>

<script>
import { refObj, Text } from 'phavuer'
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
      object: refObj(),
      mergedStyle
    }
  }
}
</script>

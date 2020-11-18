<template>
  <Text :style="{ fontSize: size, fontStyle: bold ? 'bold' : null, fontFamily: config.FONT, color: color.toColorString }" />
</template>

<script>
import { Text } from 'phavuer'
import config from '@/data/config'
export default {
  components: { Text },
  props: {
    size: { default: 15 },
    bold: { default: false },
    color: { default: config.COLORS.brown }
  },
  setup () {
    return { config }
  }
}
</script>

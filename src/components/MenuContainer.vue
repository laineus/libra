<template>
  <OrganicWindow ref="object" :x="left + width.half" :y="top + height.half" :width="width" :height="height" @pointerdown.stop @wheel="$emit('wheel', $event)" @pointermove="$emit('pointermove', $event)">
    <Image texture="menu_label" :origin="0" :x="-width.half - 20" :y="-height.half - 16" :rotation="-0.07" :scaleX="0.78" />
    <Text :text="title" :x="-width.half - 8" :y="-height.half - 9" :rotation="-0.07" :size="14" :bold="true" color="soy" />
    <Container ref="container" :x="-width.half + padding" :y="-height.half + padding + labelSpace">
      <slot />
    </Container>
  </OrganicWindow>
</template>

<script>
import { Container, Image, refObj } from 'phavuer'
import Text from '@/components/Text'
import OrganicWindow from '@/components/OrganicWindow'
import config from '@/data/config'
import { reactive, toRefs } from 'vue'
export default {
  components: { Container, Image, Text, OrganicWindow },
  props: ['height', 'title'],
  emits: ['wheel', 'pointermove'],
  setup (props) {
    const refs = reactive({
      object: refObj(null),
      container: refObj(null)
    })
    const labelSpace = 12
    const width = 240
    const padding = 5
    const right = 16
    const bottom = 96
    const left = (right + width).byRight
    const top = (bottom + props.height).byBottom
    const offsetX = left + padding
    const offsetY = top + padding + labelSpace
    return {
      ...toRefs(refs),
      COLORS: config.COLORS,
      width, labelSpace,
      padding,
      left, top,
      offsetX, offsetY
    }
  }
}
</script>

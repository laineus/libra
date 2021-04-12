<template>
  <Container ref="object" :x="left" :y="top">
    <Image texture="menu_bg" :origin="0" :x="-36" :y="(-28 * (height / 333)) + 28" :scaleX="1.06" :scaleY="height / 333" @pointerdown.stop @wheel="$emit('wheel', $event)" @pointermove="$emit('pointermove', $event)" />
    <Image texture="menu_label" :origin="0" :x="-15" :y="19" :rotation="-0.07" :scaleX="0.78" />
    <Text :text="title" :x="1" :y="27" :rotation="-0.07" :size="14" :bold="true" color="soy" />
    <Container ref="container" :x="padding" :y="labelSpace + padding">
      <slot />
    </Container>
  </Container>
</template>

<script>
import { Container, Image, refObj } from 'phavuer'
import Text from '@/components/Text'
import config from '@/data/config'
import { reactive, toRefs } from '@vue/reactivity'
export default {
  components: { Container, Image, Text },
  props: ['height', 'title'],
  emits: ['wheel', 'pointermove'],
  setup (props) {
    const refs = reactive({
      object: refObj(null),
      container: refObj(null)
    })
    const labelSpace = 45
    const width = 240
    const padding = 5
    const right = 18
    const bottom = 80
    const left = (right + width).byRight
    const top = (bottom + props.height + labelSpace).byBottom
    const offsetX = left + padding
    const offsetY = top + labelSpace + padding
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

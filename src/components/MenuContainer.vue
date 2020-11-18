<template>
  <Container :x="(margin + width).byRight" :y="(bottom + height + labelHeight).byBottom">
    <RoundRectangle :y="labelHeight" :width="width" :height="height" :fillColor="COLORS.soy" :radius="{ tl: 0, tr: radius, bl: radius, br: radius }" :origin="0" @pointerdown="onTapBg" />
    <RoundRectangle :x="padding" :y="padding + labelHeight" :width="width - padding.twice" :height="height - padding.twice" :lineWidth="2" :strokeColor="COLORS.brown" :radius="{ tl: 0, tr: radius, bl: radius, br: radius }" :origin="0" />
    <RoundRectangle :width="labelWidth" :height="labelHeight" :fillColor="COLORS.soy" :radius="{ tl: radius, tr: radius, bl: 0, br: 0 }" :originX="0" @pointerdown="onTapBg" />
    <RoundRectangle :x="padding - 1" :y="padding - 1" :width="labelWidth - padding.twice + 2" :height="labelHeight + 2" :fillColor="COLORS.brown" :radius="{ tl: radius, tr: radius, bl: 0, br: 0 }" :originX="0" />
    <Rectangle :x="arrowX" :y="height + labelHeight" :width="20" :height="20" :fillColor="COLORS.soy" :rotation="Math.PI / 4" />
    <Rectangle :x="arrowX" :y="height + labelHeight - 5.5" :width="20" :height="20" :fillColor="COLORS.soy" :rotation="Math.PI / 4" :lineWidth="2" :strokeColor="COLORS.brown" :origin="0.5" />
    <Rectangle :x="arrowX" :y="height + labelHeight - 15" :width="29" :height="20" :fillColor="COLORS.soy" />
    <Text :text="title" :x="12" :y="9" :style="{ fontSize: 16, fontStyle: 'bold', color: COLORS.soy.toColorString }" />
    <Container :x="5" :y="labelHeight + 5">
      <slot />
    </Container>
  </Container>
</template>

<script>
import { Container, Rectangle, RoundRectangle, Text } from 'phavuer'
import config from '@/data/config'
export default {
  components: { Container, Rectangle, RoundRectangle, Text },
  props: ['arrowX', 'height', 'title'],
  setup (props) {
    const margin = 15
    const padding = 4
    const width = 230
    const radius = 8
    const labelWidth = 100
    const labelHeight = 26
    const bottom = 85
    const offsetX = (margin + width).byRight + 5
    const offsetY = (bottom + props.height).byBottom + 5
    return {
      COLORS: config.COLORS,
      margin, padding,
      width,
      radius,
      bottom,
      labelWidth, labelHeight,
      offsetX, offsetY,
      onTapBg: (...args) => args[3].stopPropagation()
    }
  }
}
</script>

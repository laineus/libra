<template>
  <Container :x="(width + margin).byRight" :y="margin">
    <RoundRectangle :y="labelHeight" :width="width" :height="height" :fillColor="0xBBAA88" :radius="{ tl: 0, tr: radius, bl: radius, br: radius }" :origin="0" />
    <RoundRectangle :x="padding" :y="padding + labelHeight" :width="width - (padding * 2)" :height="height - (padding * 2)" :lineWidth="2" :strokeColor="0x553311" :radius="{ tl: 0, tr: radius, bl: radius, br: radius }" :origin="0" />
    <RoundRectangle :width="labelWidth" :height="labelHeight" :fillColor="0xBBAA88" :radius="{ tl: radius, tr: radius, bl: 0, br: 0 }" :originX="0" />
    <RoundRectangle :x="padding - 1" :y="padding - 1" :width="labelWidth - (padding * 2) + 2" :height="labelHeight + 2" :fillColor="0x553311" :radius="{ tl: radius, tr: radius, bl: 0, br: 0 }" :originX="0" />
    <Rectangle :x="24" :y="height + labelHeight" :width="20" :height="20" :fillColor="0xBBAA88" :rotation="Math.PI / 4" />
    <Rectangle :x="24" :y="height + labelHeight - 5.5" :width="20" :height="20" :fillColor="0xBBAA88" :rotation="Math.PI / 4" :lineWidth="2" :strokeColor="0x553311" :origin="0.5" />
    <Rectangle :x="24" :y="height + labelHeight - 15" :width="29" :height="20" :fillColor="0xBBAA88" />
  </Container>
</template>

<script>
import { Container, Rectangle, RoundRectangle } from 'phavuer'
export default {
  components: { Container, Rectangle, RoundRectangle },
  setup () {
    return {
      margin: 15,
      padding: 4,
      width: 230,
      height: 410,
      radius: 8,
      labelWidth: 120,
      labelHeight: 26
    }
  }
}
</script>

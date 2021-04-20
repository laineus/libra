<template>
  <Container :depth="config.DEPTH.TALK">
    <OrganicRectangle :fillColor="config.COLORS.brown" :width="bgWidth + 24 + 2" :height="sumHeight + 2" :y="-sumHeight.half" />
    <OrganicRectangle :fillColor="config.COLORS.soy" :width="bgWidth + 24" :height="sumHeight" :y="-sumHeight.half" />
    <Image texture="menu_arrow" :origin="0.5" :scale="0.7" :rotation="-0.07" :tint="config.COLORS.brown" :y="8.5" />
    <Image texture="menu_arrow" :origin="0.5" :scale="0.7" :rotation="-0.07" :tint="config.COLORS.soy" :y="7" />
    <Container v-for="(v, i) in options" :key="i" :y="-sumHeight + (bgHeight + 5) * i + 2.5">
      <Image texture="menu_label" :originX="0.5" :originY="0" :y="-1" :rotation="-0.015" :scaleX="(bgWidth + 15) / 138" :scaleY="0.9" @pointerdown.stop="select($event, i)" />
      <Text :ref="v.ref" :originX="0.5" :originY="0" :text="v.text" :size="14" color="soy" :y="5" :lineSpacing="3" />
    </Container>
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { reactive, toRefs, onMounted, inject } from 'vue'
import config from '@/data/config'
import Text from '@/components/Text'
import OrganicRectangle from '@/components/OrganicRectangle'
export default {
  components: { Container, Image, Text, OrganicRectangle },
  props: ['list'],
  emits: ['select'],
  setup (props, context) {
    const audio = inject('audio')
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
      audio.se('click')
      context.emit('select', i)
    }
    const sumHeight = (data.bgHeight + 5) * options.length
    return {
      config, COLORS: config.COLORS,
      options,
      ...toRefs(data),
      select,
      sumHeight
    }
  }
}
</script>

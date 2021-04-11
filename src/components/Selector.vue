<template>
  <Container :depth="config.DEPTH.TALK">
    <Container :x="-bgWidth.half" :y="-sumHeight">
      <Image texture="select_bg" :origin="0.5" :x="bgWidth.half" :y="sumHeight.half" :scaleX="(bgWidth + 40) / 162" :scaleY="(sumHeight + 30) / 84" />
      <Image texture="select_arrow" :origin="0.5" :x="bgWidth.half" :y="sumHeight - 6" />
      <Container v-for="(v, i) in options" :key="i" :y="(bgHeight + 2) * i">
        <Image texture="menu_label" :origin="0.5" :x="bgWidth.half" :y="bgHeight.half + 1" :scaleX="(bgWidth + 20) / 112" :scaleY="0.9" @pointerdown.stop="select($event, i)" />
        <Text :ref="v.ref" :originX="0.5" :x="bgWidth.half" :text="v.text" :size="14" color="soy" :y="5" :lineSpacing="3" />
      </Container>
    </Container>
  </Container>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { reactive, toRefs, onMounted, inject } from 'vue'
import config from '@/data/config'
import Text from '@/components/Text'
export default {
  components: { Container, Image, Text },
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
    const sumHeight = (data.bgHeight + 2) * options.length
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

<template>
  <Container :x="0" :y="0" v-if="current">
    <Rectangle :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="next" />
    <SpeachBubble :x="x" :y="y" :width="bgWidth" :height="bgHeight">
      <Text ref="name" v-if="current.chara" :text="current.chara.name" :style="{ fontSize: 15, fontStyle: 'bold', color: COLORS.soy.toColorString, stroke: COLORS.brown.toColorString, strokeThickness: 3 }" :originX="0" :originY="1" :x="4" :y="4" />
      <Text ref="txt" :text="current.text" :style="{ fontSize: 14, fontStyle: 'normal', color: COLORS.brown.toColorString }" :x="7" :y="7" :lineSpacing="3" :padding="{ top: 2 }" />
    </SpeachBubble>
  </Container>
</template>

<script>
import { refObj, Container, Rectangle, Text } from 'phavuer'
import { computed, ref, inject, onUpdated, reactive, toRefs } from 'vue'
import SpeachBubble from './SpeachBubble'
import config from '@/data/config'
export default {
  components: { Container, Rectangle, Text, SpeachBubble },
  setup () {
    // inject
    const camera = inject('camera')
    // refs
    const bg = refObj()
    const txt = refObj()
    // data
    const list = ref([])
    const current = computed(() => list.value[0])
    let resolver = null
    const data = reactive({
      x: computed(() => current.value?.chara.x - camera.value?.scrollX),
      y: computed(() => current.value?.chara.y - camera.value?.scrollY - 50),
      bgWidth: 0,
      bgHeight: 0
    })
    const setTalk = array => {
      if (resolver) resolver()
      list.value.splice(0)
      return new Promise(resolve => {
        list.value.push(...array)
        resolver = resolve
      })
    }
    const next = (pointer) => {
      pointer.isDown = false
      list.value.splice(0, 1)
      if (!list.value.length && resolver) resolver()
    }
    onUpdated(() => {
      if (!current.value) return
      data.bgWidth = Math.max(txt.value.width + 14, 100)
      data.bgHeight = txt.value.height + 14
    })
    return {
      config, COLORS: config.COLORS,
      current,
      next,
      setTalk,
      bg, txt,
      ...toRefs(data)
    }
  }
}
</script>

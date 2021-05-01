<template>
  <Container :x="0" :y="0" v-if="current" :depth="config.DEPTH.TALK">
    <Rectangle :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="next" />
    <SpeachBubble :x="x" :y="y" :width="bgWidth" :height="bgHeight">
      <Text ref="name" v-if="current.chara" :text="current.chara.name" :size="15" :bold="true" color="soy" :style="{ stroke: COLORS.brown.toColorString, strokeThickness: 3 }" :originX="0" :originY="1" :x="-2" :y="7" :rotation="-0.05" />
      <Text ref="txt" :text="current.text" :size="adjustFontSize(14)" :x="bgWidth.half" :y="6" :originX="0.5" :lineSpacing="3" :padding="{ top: 2 }" :style="{ wordWrap: { width: 240, useAdvancedWrap: true } }" />
    </SpeachBubble>
  </Container>
</template>

<script>
import { refObj, Container, Rectangle } from 'phavuer'
import { computed, ref, inject, onUpdated, reactive, toRefs } from 'vue'
import config from '@/data/config'
import adjustFontSize from '@/util/adjustFontSize'
import SpeachBubble from '@/components/SpeachBubble'
import Text from '@/components/Text'
export default {
  components: { Container, Rectangle, Text, SpeachBubble },
  setup () {
    // inject
    const camera = inject('camera')
    const audio = inject('audio')
    // refs
    const bg = refObj()
    const txt = refObj()
    // data
    const list = ref([])
    const current = computed(() => list.value[0])
    let resolver = null
    const data = reactive({
      x: computed(() => current.value?.chara.x - camera.value?.scrollX),
      y: computed(() => current.value?.chara.y - camera.value?.scrollY - 75),
      bgWidth: 0,
      bgHeight: 0
    })
    const setTalk = array => {
      if (resolver) resolver()
      list.value.splice(0)
      if (array.length) audio.se('talk')
      return new Promise(resolve => {
        list.value.push(...array)
        resolver = resolve
      })
    }
    const getSpeakScripts = chara => scripts => {
      const list = [].concat(scripts).map(text => {
        return { chara, text }
      })
      return setTalk(list)
    }
    const next = (pointer) => {
      pointer.isDown = false
      list.value.splice(0, 1)
      if (!list.value.length && resolver) return resolver()
      audio.se('talk')
    }
    onUpdated(() => {
      if (!current.value) return
      data.bgWidth = Math.max(txt.value.width + 24, 70)
      data.bgHeight = txt.value.height + 10
    })
    return {
      config, COLORS: config.COLORS,
      adjustFontSize,
      current,
      next,
      setTalk, getSpeakScripts,
      bg, txt,
      ...toRefs(data)
    }
  }
}
</script>

<template>
  <Container>
    <template v-if="!selected">
      <Container v-for="(v, i) in list.slice(offset, offset + 7)" :key="i" :x="rowWidth.half + 10" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerup="p => tapItem(p, v)" @wheel="onWheel" @pointermove.stop="onSwipe">
        <Rectangle :visible="v === selected" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
        <Line v-if="i !== 7 - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
        <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.title" :size="13" :bold="true" />
      </Container>
    </template>
    <Container v-if="selected">
      <Text :x="10" :y="10" text="← Back" :size="12" :bold="true" @pointerup.stop="back" />
      <Text :x="10" :y="40" :text="selected.title" :size="adjustFontSize(14)" :bold="true" />
      <Text :x="10" :y="70" :text="selected.desc" :size="adjustFontSize(13)" :style="{ wordWrap: { width: 210, useAdvancedWrap: true } }" :lineSpacing="5" />
    </Container>
    <ScrollBar ref="scrollBar" :visible="!selected" :x="rowWidth + 21" :y="3" :height="(rowHeight * 7) - (3).twice" :length="list.length" :limit="7" v-model="offset" />
  </Container>
</template>

<script>
import { reactive, toRefs, ref, inject } from 'vue'
import { Container, Rectangle, Line } from 'phavuer'
import adjustFontSize from '@/util/adjustFontSize'
import config from '@/data/config'
import Text from '@/components/Text'
import ScrollBar from '@/components/ScrollBar'
export default {
  components: { Container, Rectangle, Line, Text, ScrollBar },
  setup () {
    const audio = inject('audio')
    const mobile = inject('mobile')
    const keys = ['hp', 'charm', 'weight', 'use', 'dispose', 'store', 'amili', 'people', 'gun', 'murder', 'screenshot']
    const list = keys.filter(key => {
      if (key === 'screenshot' && mobile) return false
      return true
    }).map(key => {
      return { title: t(`tips.${key}.title`), desc: t(`tips.${key}.desc`) }
    })
    const refs = { scrollBar: ref(null) }
    const data = reactive({
      selected: null,
      rowWidth: 215,
      rowHeight: 37,
      offset: 0
    })
    const tapItem = async (pointer, v) => {
      if (pointer.isMoved) return
      audio.se('click')
      data.selected = v
    }
    const back = () => {
      data.selected = null
      audio.se('cancel')
    }
    const onWheel = pointer => refs.scrollBar.value.add(Math.sign(pointer.deltaY))
    const onSwipe = pointer => refs.scrollBar.value.swipe(pointer)
    return {
      t,
      COLORS: config.COLORS,
      adjustFontSize,
      list,
      ...refs,
      ...toRefs(data),
      tapItem,
      back,
      onWheel, onSwipe
    }
  }
}
</script>

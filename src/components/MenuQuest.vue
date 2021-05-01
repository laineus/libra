<template>
  <MenuContainer ref="container" :height="320" :title="t('ui.quest')" @wheel="onWheel" @pointermove.stop="onSwipe">
    <Image texture="menu_arrow" :x="118" :y="320" :rotation="-0.1" :tint="COLORS.soy" />
    <Container v-for="(v, i) in quest.slice(offset, offset + 8)" :key="i" :visible="!selected" :x="rowWidth.half + 10" :y="(i * rowHeight) + rowHeight.half + 5" :width="rowWidth" :height="rowHeight" @pointerup.stop="p => tapItem(p, v)">
      <Line v-if="i !== 8 - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.started(state) ? t(`quest.${v.key}.title`) : '？？？'" :size="13" :bold="v.started(state)" />
      <Image :x="rowWidth.half - 12" :y="0" :originY="0.5" texture="check" frame="3" :scale="0.9" :tint="COLORS.brown" v-if="v.completed(state)" />
    </Container>
    <Container v-if="selected">
      <Text :x="10" :y="10" text="← Back" :size="12" :bold="true" @pointerup.stop="back" />
      <Text :x="10" :y="40" :text="t(`quest.${selected.key}.title`)" :size="adjustFontSize(14)" :bold="true" />
      <Text :x="10" :y="70" :text="`${t('ui.location')}:\n${t('ui.client')}:`" :size="adjustFontSize(12)" :bold="true" :lineSpacing="3" />
      <Text :x="78" :y="70" :text="`${t(`place.${selected.place}`)}\n${t(`name.${selected.chara}`)}`" :size="adjustFontSize(12)" :lineSpacing="3" />
      <Text :x="10" :y="116" :text="t(`quest.${selected.key}.desc`)" :size="adjustFontSize(13)" :style="{ wordWrap: { width: 210, useAdvancedWrap: true } }" :lineSpacing="5" />
    </Container>
    <ScrollBar ref="scrollBar" :visible="!selected" :x="rowWidth + 21" :y="3" :height="289" :length="quest.length" :limit="8" v-model="offset" />
  </MenuContainer>
</template>

<script>
import { inject, reactive, ref, toRefs } from 'vue'
import { Container, Line, Image } from 'phavuer'
import adjustFontSize from '@/util/adjustFontSize'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import ScrollBar from '@/components/ScrollBar'
import quest from '@/data/quest'
import config from '@/data/config'
export default {
  components: { MenuContainer, Container, Text, ScrollBar, Line, Image },
  emits: ['close'],
  setup (_, context) {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const audio = inject('audio')
    const achieve = inject('achieve')
    const refs = {
      scrollBar: ref(null),
      container: ref(null)
    }
    const data = reactive({
      selected: null,
      offset: 0,
      rowWidth: 215, rowHeight: 37
    })
    const tapItem = (p, v) => {
      if (p.isMoved || !v.started(state)) return
      audio.se('click')
      data.selected = v
    }
    const back = p => {
      if (p.isMoved) return
      audio.se('cancel')
      data.selected = null
    }
    const onWheel = pointer => refs.scrollBar.value.add(Math.sign(pointer.deltaY))
    const onSwipe = pointer => refs.scrollBar.value.swipe(pointer)
    if (state.status.body > 0 || state.status.heart > 0) {
      uiScene.setTutorial('quest')
    }
    if (quest.every(q => q.started(state))) {
      achieve.activate('quest')
    }
    return {
      t,
      state,
      COLORS: config.COLORS,
      adjustFontSize,
      quest,
      ...refs,
      ...toRefs(data),
      tapItem, back,
      onWheel, onSwipe
    }
  }
}
</script>

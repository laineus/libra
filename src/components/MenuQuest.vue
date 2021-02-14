<template>
  <MenuContainer ref="container" :arrowX="25 + (1 * 60)" :height="305" :title="t('ui.quest')" @wheel="onWheel" @pointermove.stop="onSwipe">
    <Container v-for="(v, i) in quest.slice(offset, offset + 8)" :key="i" :visible="!selected" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerup.stop="p => tapItem(p, v)">
      <Line v-if="i !== 8 - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.started(state) ? t(`quest.${v.key}.title`) : '？？？'" :size="13" :bold="v.started(state)" />
      <Image :x="rowWidth.half - 12" :y="0" :originY="0.5" texture="check" frame="1" :tint="COLORS.brown" v-if="v.completed(state)" />
    </Container>
    <Container v-if="selected">
      <Text :x="10" :y="10" text="← Back" :size="12" :bold="true" @pointerup.stop="back" />
      <Text :x="10" :y="40" :text="t(`quest.${selected.key}.title`)" :size="14" :bold="true" />
      <Text :x="10" :y="70" :text="`${t('ui.location')}:\n${t('ui.client')}:`" :size="12" :bold="true" />
      <Text :x="65" :y="70" :text="`${t(`place.${selected.place}`)}\n${t(`name.${selected.chara}`)}`" :size="12" />
      <Text :x="10" :y="115" :text="t(`quest.${selected.key}.desc`)" :size="13" :style="{ wordWrap: { width: 200, useAdvancedWrap: true } }" />
    </Container>
    <Container :visible="!selected" :x="rowWidth + 13 - 3" :y="3">
      <RoundRectangle :width="5" :height="289" :radius="3" :fillColor="COLORS.brown" :originX="1" :originY="0" :alpha="0.3" />
      <RoundRectangle :y="289 / quest.length * offset" :width="5" :height="289 * (8 / quest.length)" :radius="3" :fillColor="COLORS.brown" :originX="1" :originY="0" />
    </Container>
  </MenuContainer>
</template>

<script>
import { inject, reactive, ref, toRefs } from 'vue'
import { Container, RoundRectangle, Line, Image } from 'phavuer'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import quest from '@/data/quest'
import config from '@/data/config'
export default {
  components: { MenuContainer, Container, RoundRectangle, Text, Line, Image },
  emits: ['close'],
  setup (_, context) {
    const state = inject('storage').state
    const container = ref(null)
    const data = reactive({
      selected: null,
      offset: 0,
      rowWidth: 207, rowHeight: 37,
      selectedIndex: null
    })
    const tapItem = (p, v) => {
      if (p.isMoved || !v.started(state)) return
      data.selected = v
    }
    const back = p => {
      if (p.isMoved) return
      data.selected = null
    }
    const addOffset = v => {
      data.offset = Math.fix(data.offset + v, 0, quest.length - 8)
    }
    const onWheel = pointer => addOffset(Math.sign(pointer.deltaY))
    let scrollY = 0
    const onSwipe = pointer => {
      if (!pointer.isDown) return
      scrollY += pointer.prevPosition.y - pointer.position.y
      if (Math.abs(scrollY) < 15) return
      addOffset(Math.sign(scrollY))
      scrollY = 0
    }
    return {
      t,
      state,
      COLORS: config.COLORS,
      quest,
      container,
      ...toRefs(data),
      tapItem, back,
      onWheel, onSwipe
    }
  }
}
</script>

<template>
  <MenuContainer ref="container" :arrowX="25 + (1 * 60)" :height="305" title="Quest" @wheel="onWheel" @pointermove="onSwipe">
    <Container v-for="(v, i) in quest.slice(offset, offset + 8)" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerup="p => tapItem(p, i)">
      <Line v-if="i !== 8 - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="t(`quest.${v.key}.title`)" :size="13" :bold="true" />
    </Container>
    <RoundRectangle :x="rowWidth + 13 - 3" :y="3" :width="5" :height="289" :radius="3" :fillColor="COLORS.brown" :originX="1" :originY="0" :alpha="0.3" />
    <RoundRectangle :x="rowWidth + 13 - 3" :y="3 + (289 / quest.length * offset)" :width="5" :height="289 * (8 / quest.length)" :radius="3" :fillColor="COLORS.brown" :originX="1" :originY="0" />
  </MenuContainer>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { Container, RoundRectangle, Line } from 'phavuer'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import quest from '@/data/quest'
import config from '@/data/config'
export default {
  components: { MenuContainer, Container, RoundRectangle, Text, Line },
  emits: ['close'],
  setup (_, context) {
    const container = ref(null)
    const data = reactive({
      offset: 0,
      rowWidth: 207, rowHeight: 37,
      selectedIndex: null
    })
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
    const tapItem = (pointer, i) => {
    }
    return {
      t,
      COLORS: config.COLORS,
      quest,
      container,
      ...toRefs(data),
      tapItem,
      onWheel, onSwipe
    }
  }
}
</script>

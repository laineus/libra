<template>
  <MenuContainer ref="container" :arrowX="25 + (2 * 60)" :height="305" title="Quest">
    <Container v-for="(v, i) in places.slice(offset, offset + 8)" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerup="p => tapItem(p, i)">
      <Line v-if="i !== places.length - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.key" :size="13" :bold="true" @pointerup="p => tapItem(p, i)" /><!-- TODO -->
    </Container>
    <RoundRectangle :x="rowWidth - 3" :y="3 + (289 / places.length * offset)" :width="5" :height="289 * (8 / places.length)" :radius="3" :fillColor="COLORS.brown" :originX="1" :originY="0" />
  </MenuContainer>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { Container, RoundRectangle, Line } from 'phavuer'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import config from '@/data/config'
export default {
  components: { MenuContainer, Container, RoundRectangle, Text, Line },
  emits: ['close'],
  setup (_, context) {
    const container = ref(null)
    const places = [
      { key: 'asd1' },
      { key: 'asd2' },
      { key: 'asd3' },
      { key: 'asd4' },
      { key: 'asd5' },
      { key: 'asd6' },
      { key: 'asd7' },
      { key: 'asd8' },
      { key: 'asd9' },
      { key: 'asd10' },
      { key: 'asd11' },
      { key: 'asd12' },
      { key: 'asd13' },
      { key: 'asd14' }
    ]
    const data = reactive({
      offset: 0,
      rowWidth: 220, rowHeight: 37,
      selectedIndex: null
    })
    onMounted(() => {
      container.value.bg.setInteractive().on('wheel', e => {
        data.offset = Math.fix(data.offset + Math.sign(e.deltaY), 0, places.length - 8)
      })
    })
    const tapItem = (pointer, i) => {
    }
    return {
      COLORS: config.COLORS,
      places,
      container,
      ...toRefs(data),
      tapItem
    }
  }
}
</script>

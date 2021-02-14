<template>
  <Container>
    <template v-if="!selected">
      <Container v-for="(v, i) in list" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => tapItem(p, i)">
        <Rectangle :visible="i === selectedIndex" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
        <Line v-if="i !== list.length - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
        <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.title" :size="13" :bold="true" />
      </Container>
    </template>
    <Container v-if="selected">
      <Text :x="10" :y="10" text="← Back" :size="12" :bold="true" @pointerdown.stop="selectedIndex = null" />
      <Text :x="10" :y="40" :text="selected.title" :size="14" :bold="true" />
      <Text :x="10" :y="70" :text="selected.desc" :size="13" :style="{ wordWrap: { width: 200, useAdvancedWrap: true } }" />
    </Container>
  </Container>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { Container, Rectangle, Line } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
export default {
  components: { Container, Rectangle, Text, Line },
  setup (props, context) {
    const list = [{ title: 'title1', desc: 'description1' }, { title: 'title2', desc: 'description2' }]
    const data = reactive({
      rowWidth: 220,
      rowHeight: 37,
      selectedIndex: null
    })
    const selected = computed(() => list[data.selectedIndex])
    const tapItem = async (pointer, i) => {
      data.selectedIndex = i
    }
    return {
      t,
      COLORS: config.COLORS,
      list,
      ...toRefs(data),
      selected,
      tapItem
    }
  }
}
</script>

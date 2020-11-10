<template>
  <MenuContainer ref="container" :arrowX="25 + (2 * 60)" :height="320" :title="'Map'">
    <Container v-for="(v, i) in slots" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => onTap(p, i)">
      <Rectangle :visible="i === selectedIndex" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
      <Line :x="0" :y="rowHeight.half - 0.5" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v ? `${v.key} x: ${v.x} y: ${v.y}` : '未登録'" :style="{ fontSize: 13, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    </Container>
    <Selector v-if="selectedIndex !== null" :x="tapX" :y="tapY" :list="[places[selectedIndex] ? '登録した場所へ移動' : '現在地を登録', 'キャンセル']" @select="submit" />
  </MenuContainer>
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
import { computed, inject, reactive, ref, toRefs } from 'vue'
import { Container, Rectangle, Text, Line } from 'phavuer'
import config from '@/data/config'
import Selector from './Selector'
export default {
  components: { MenuContainer, Container, Rectangle, Text, Line, Selector },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene').value
    const storage = inject('storage')
    const container = ref(null)
    const places = storage.state.places
    const slots = computed(() => {
      const emptySlots = (8 - places.length).toArray().map(() => null)
      return storage.state.places.concat(emptySlots)
    })
    const data = reactive({
      rowWidth: 220, rowHeight: 35,
      selectedIndex: null,
      tapX: 0, tapY: 0
    })
    const submit = i => {
      if (i === 1) return data.selectedIndex = null
      const place = places[data.selectedIndex]
      if (place) {
        gameScene.setField(place.key, place.x, place.y)
      } else {
        // TODO
      }
      context.emit('close')
    }
    return {
      COLORS: config.COLORS,
      places,
      slots,
      container,
      ...toRefs(data),
      submit,
      onTap: (pointer, i) => {
        if (data.selectedIndex) {
          data.selectedIndex = null
          return
        }
        data.tapX = pointer.x - container.value.offsetX + 5
        data.tapY = pointer.y - container.value.offsetY - 10
        data.selectedIndex = i
      }
    }
  }
}
</script>

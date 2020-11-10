<template>
  <MenuContainer ref="container" :arrowX="25 + (2 * 60)" :height="320" :title="'Map'">
    <Container v-for="(v, i) in places" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => onTap(p, v)">
      <Rectangle :visible="v === selected" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
      <Line :x="0" :y="rowHeight.half - 0.5" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="`${v.key} x: ${v.x} y: ${v.y}`" :style="{ fontSize: 13, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    </Container>
    <Selector v-if="selected" :x="tapX" :y="tapY" :list="['移動', 'キャンセル']" @select="submit" />
  </MenuContainer>
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
import { inject, reactive, ref, toRefs } from 'vue'
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
    const data = reactive({
      rowWidth: 220, rowHeight: 35,
      selected: null,
      tapX: 0, tapY: 0
    })
    const submit = i => {
      if (i === 1) return data.selected = null
      const place = data.selected
      gameScene.setField(place.key, place.x, place.y)
      context.emit('close')
    }
    return {
      COLORS: config.COLORS,
      places,
      container,
      ...toRefs(data),
      submit,
      onTap: (pointer, place) => {
        if (data.selected) {
          data.selected = null
          return
        }
        data.tapX = pointer.x - container.value.offsetX + 5
        data.tapY = pointer.y - container.value.offsetY - 10
        data.selected = place
      }
    }
  }
}
</script>

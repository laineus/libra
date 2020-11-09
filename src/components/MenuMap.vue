<template>
  <MenuContainer ref="container" :arrowX="25 + (2 * 60)" :height="320" :title="'Map'">
    <Container v-for="(v, i) in places" :key="i" :y="i * 30">
      <Text :x="10" :y="8" :text="`${v.key} x: ${v.x} y: ${v.y}`" :style="{ fontSize: 13, fontStyle: 'bold', color: '#553311' }" @pointerdown="p => onTap(p, v)" />
    </Container>
    <Selector v-if="data.selected" :x="data.tapX" :y="data.tapY" :list="['へ移動', 'キャンセル']" @select="submit" />
  </MenuContainer>
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
import { inject, reactive, ref } from 'vue'
import { Container, Text } from 'phavuer'
import Selector from './Selector'
export default {
  components: { MenuContainer, Container, Text, Selector },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene').value
    const storage = inject('storage')
    const container = ref(null)
    const places = storage.state.places
    const data = reactive({
      selected: null,
      tapX: 0, tapY: 0
    })
    const submit = i => {
      if (i === 1) return data.selected = null
      const place = places[i]
      gameScene.setField(place.key, place.x, place.y)
      context.emit('close')
    }
    return {
      places,
      container,
      data,
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

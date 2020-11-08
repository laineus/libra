<template>
  <MenuContainer :arrowX="25 + (2 * 60)" :height="320" :title="'Map'">
    <Container v-for="(v, i) in places" :key="i" :y="i * 30">
      <Text :x="10" :y="8" :text="`${v.key} x: ${v.x} y: ${v.y}`" :style="{ fontSize: 13, fontStyle: 'bold', color: '#553311' }" @pointerdown="onTap(v)" />
    </Container>
    <Selector v-if="selected" :x="20" :y="70" :list="['へ移動', 'キャンセル']" @select="submit" />
  </MenuContainer>
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
import { inject, ref } from 'vue'
import { Container, Text } from 'phavuer'
import Selector from './Selector'
export default {
  components: { MenuContainer, Container, Text, Selector },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene').value
    const storage = inject('storage')
    const places = storage.state.places
    const selected = ref(null)
    const submit = i => {
      if (i === 1) return selected.value = null
      const place = places[i]
      gameScene.setField(place.key, place.x, place.y)
      context.emit('close')
    }
    return {
      places,
      selected,
      submit,
      onTap: (place) => {
        selected.value = place
      }
    }
  }
}
</script>

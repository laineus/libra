<template>
  <MenuContainer :arrowX="25 + (2 * 60)" :height="320" :title="'Map'">
    <Container v-for="(v, i) in places" :key="i" :y="i * 30">
      <Text :x="10" :y="8" :text="`${v.key} x: ${v.x} y: ${v.y}`" :style="{ fontSize: 13, fontStyle: 'bold', color: '#553311' }" @pointerdown="onTap(v)" />
    </Container>
  </MenuContainer>
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
import { inject } from 'vue'
import { Container, Text } from 'phavuer'
export default {
  components: { MenuContainer, Container, Text },
  setup () {
    const gameScene = inject('gameScene').value
    const storage = inject('storage')
    const places = storage.state.places
    return {
      places,
      onTap: (place) => {
        gameScene.setField(place.key, place.x, place.y)
      }
    }
  }
}
</script>

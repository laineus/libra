<template>
  <MenuContainer ref="container" :arrowX="25 + (3 * 60)" :height="300" :title="'System'">
    <Container v-for="(v, i) in tabs" :key="i" :x="5.5 + (i * 67)" :y="5.5">
      <RoundRectangle :width="60" :height="24" :lineWidth="1" :strokeColor="COLORS.brown" :radius="4" :fillColor="index === i ? COLORS.brown : null" @pointerdown="index = i" />
      <Text :text="v.label" :origin="0.5" :x="30" :y="12" :style="{ fontSize: 13, fontStyle: 'bold', color: (index === i ? COLORS.soy : COLORS.brown).toColorString }" />
    </Container>
    <MenuSystemSave v-if="index === 0" :offsetX="offsetX" :offsetY="offsetY + 32" :y="32" />
  </MenuContainer>
</template>

<script>
import { computed, ref } from 'vue'
import { Container, RoundRectangle, Text } from 'phavuer'
import config from '@/data/config'
import MenuContainer from '@/components/MenuContainer'
import MenuSystemSave from '@/components/MenuSystemSave'
export default {
  components: { Container, RoundRectangle, Text, MenuContainer, MenuSystemSave },
  setup () {
    const container = ref(null)
    const tabs = [
      { label: 'Save' },
      { label: 'Config' }
    ]
    const index = ref(0)
    return {
      COLORS: config.COLORS,
      container,
      tabs, index,
      offsetX: computed(() => container.value?.offsetX),
      offsetY: computed(() => container.value?.offsetY)
    }
  }
}
</script>

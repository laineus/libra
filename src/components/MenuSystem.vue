<template>
  <MenuContainer ref="container" :arrowX="25 + (3 * 60)" :height="300" :title="'System'">
    <Container v-for="(v, i) in tabs" :key="i" :x="6.5 + (i * 67)" :y="6.5">
      <RoundRectangle :width="60" :height="24" :lineWidth="1" :strokeColor="COLORS.brown" :radius="6" :fillColor="index === i ? COLORS.brown : null" @pointerdown="index = i" />
      <Text :text="v.label" :origin="0.5" :x="30" :y="12" :size="13" :bold="true" :color="index === i ? 'soy' : 'brown'" />
    </Container>
    <MenuSystemSave v-if="index === 0" :offsetX="offsetX" :offsetY="offsetY + 32" :y="32" />
    <MenuSystemConfig v-else-if="index === 1" :offsetX="offsetX" :offsetY="offsetY + 32" :y="32" />
  </MenuContainer>
</template>

<script>
import { computed, ref } from 'vue'
import { Container, RoundRectangle } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
import MenuContainer from '@/components/MenuContainer'
import MenuSystemSave from '@/components/MenuSystemSave'
import MenuSystemConfig from '@/components/MenuSystemConfig'
export default {
  components: { Container, RoundRectangle, Text, MenuContainer, MenuSystemSave, MenuSystemConfig },
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

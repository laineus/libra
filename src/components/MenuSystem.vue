<template>
  <MenuContainer ref="container" :height="315" :title="t('ui.system')">
    <Image texture="menu_arrow" :x="210" :y="315 - 12" :rotation="-0.2" />
    <Container v-for="(v, i) in tabs" :key="i" :x="6.5 + (i * 65)" :y="6.5">
      <RoundRectangle :width="58" :height="24" :lineWidth="1" :strokeColor="COLORS.brown" :radius="6" :fillColor="index === i ? COLORS.brown : null" @pointerdown="tapItem(i)" />
      <Text :text="t(`ui.${v}`)" :origin="0.5" :x="29" :y="12" :size="12" :bold="true" :color="index === i ? 'soy' : 'brown'" />
    </Container>
    <MenuSystemSave v-if="index === 0" :offsetX="offsetX" :offsetY="offsetY + 32" :y="32" />
    <MenuSystemConfig v-else-if="index === 1" :offsetX="offsetX" :offsetY="offsetY + 32" :y="32" />
    <MenuSystemTips v-else-if="index === 2" :y="32" />
  </MenuContainer>
</template>

<script>
import { computed, ref, inject } from 'vue'
import { Container, RoundRectangle, Image } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
import MenuContainer from '@/components/MenuContainer'
import MenuSystemSave from '@/components/MenuSystemSave'
import MenuSystemConfig from '@/components/MenuSystemConfig'
import MenuSystemTips from '@/components/MenuSystemTips'
export default {
  components: { Container, RoundRectangle, Image, Text, MenuContainer, MenuSystemSave, MenuSystemConfig, MenuSystemTips },
  setup () {
    const audio = inject('audio')
    const container = ref(null)
    const tabs = ['save', 'config', 'tips']
    const index = ref(0)
    const tapItem = i => {
      if (index.value === i) return
      index.value = i
      audio.se('click')
    }
    return {
      t,
      COLORS: config.COLORS,
      container,
      tabs, index,
      tapItem,
      offsetX: computed(() => container.value?.offsetX),
      offsetY: computed(() => container.value?.offsetY)
    }
  }
}
</script>

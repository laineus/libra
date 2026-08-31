<template>
  <MenuContainer ref="container" :height="315" :title="t('ui.system')">
    <Image texture="menu_arrow" :x="210" :y="308" :rotation="-0.15" :tint="COLORS.soy" />
    <Container v-for="(v, i) in tabs" :key="i" :x="8.5 + (i * 65)" :y="8.5">
      <Rectangle :origin="0" :width="58" :height="24" :lineWidth="1" :strokeColor="COLORS.brown" :radius="8" :fillColor="COLORS.brown" :fillAlpha="index === i ? 1 : 0" @pointerdown="tapItem(i)" />
      <Rectangle v-if="gamepadMode && focusTabs && index === i" :origin="0" :width="58" :height="24" :lineWidth="2" :strokeColor="COLORS.orange" :radius="8" />
      <Text :text="t(`ui.${v}`)" :origin="0.5" :x="29" :y="12" :size="12" :bold="true" :color="index === i ? 'soy' : 'brown'" />
    </Container>
    <MenuSystemSave ref="save" v-if="index === 0" :controllerActive="!focusTabs" :offsetX="offsetX" :offsetY="offsetY + 32" :y="38" />
    <MenuSystemConfig ref="config" v-else-if="index === 1" :controllerActive="!focusTabs" :offsetX="offsetX" :offsetY="offsetY + 32" :y="38" />
    <MenuSystemTips ref="tips" v-else-if="index === 2" :controllerActive="!focusTabs" :y="34" />
  </MenuContainer>
</template>

<script>
import { computed, ref, inject } from 'vue'
import { Container, Rectangle, Image } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text.vue'
import MenuContainer from '@/components/MenuContainer.vue'
import MenuSystemSave from '@/components/MenuSystemSave.vue'
import MenuSystemConfig from '@/components/MenuSystemConfig.vue'
import MenuSystemTips from '@/components/MenuSystemTips.vue'
export default {
  components: { Container, Rectangle, Image, Text, MenuContainer, MenuSystemSave, MenuSystemConfig, MenuSystemTips },
  emits: ['close'],
  setup () {
    const audio = inject('audio')
    const controller = inject('controller')
    const container = ref(null)
    const children = [ref(null), ref(null), ref(null)]
    const tabs = ['save', 'config', 'tips']
    const index = ref(0)
    const focusTabs = ref(true)
    const tapItem = i => {
      if (index.value === i) return
      index.value = i
      audio.se('click')
    }
    const current = () => children[index.value].value
    const navigate = direction => {
      if (focusTabs.value) {
        if (direction.x) tapItem((index.value + direction.x + tabs.length) % tabs.length)
        if (direction.y > 0) focusTabs.value = false
        return
      }
      if (current()?.navigate?.(direction) === 'tabs') focusTabs.value = true
    }
    const confirm = () => {
      if (focusTabs.value) {
        focusTabs.value = false
        return
      }
      current()?.confirm?.()
    }
    const cancel = () => Boolean(current()?.cancel?.())
    return {
      t,
      COLORS: config.COLORS,
      container,
      tabs, index,
      save: children[0], config: children[1], tips: children[2],
      gamepadMode: computed(() => controller.value?.gamepadMode),
      focusTabs,
      tapItem,
      navigate, confirm, cancel,
      offsetX: computed(() => container.value?.offsetX),
      offsetY: computed(() => container.value?.offsetY)
    }
  }
}
</script>

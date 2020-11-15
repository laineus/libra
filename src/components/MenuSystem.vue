<template>
  <MenuContainer ref="container" :arrowX="25 + (3 * 60)" :height="342" :title="'System'">
    <MenuSystemSave :offsetX="offsetX" :offsetY="offsetY" />
  </MenuContainer>
</template>

<script>
import { computed, ref } from 'vue'
import MenuContainer from '@/components/MenuContainer'
import MenuSystemSave from '@/components/MenuSystemSave'
export default {
  components: { MenuContainer, MenuSystemSave },
  setup () {
    const container = ref(null)
    return {
      container,
      offsetX: computed(() => container.value?.offsetX),
      offsetY: computed(() => container.value?.offsetY)
    }
  }
}
</script>

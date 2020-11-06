<template>
  <MenuContainer :arrowX="25 + (3 * 60)" :height="320" :title="'System'" />
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
export default {
  components: { MenuContainer },
  setup () {
    return {
    }
  }
}
</script>

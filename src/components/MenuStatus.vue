<template>
  <MenuContainer :arrowX="25 + (0 * 60)" :height="320" :title="'Status'" />
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

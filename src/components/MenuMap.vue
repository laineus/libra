<template>
  <MenuContainer :arrowX="25 + (2 * 60)" :height="320" :title="'Map'" />
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

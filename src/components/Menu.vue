<template>
  <div>
    <Circle v-for="(v, i) in menu" :key="i" :fillColor="0xBBAA88" :radius="25" :x="(220).byRight + (i * 60)" :y="(40).byBottom" @pointerdown="p => select(i, p)" />
    <component v-if="selected" :is="selected.component" />
  </div>
</template>

<script>
import { Circle } from 'phavuer'
import MenuBag from '@/components/MenuBag'
import { computed, ref } from 'vue'
const menu = [
  { name: 'Status', component: 'MenuStatus' },
  { name: 'Bag', component: 'MenuBag' },
  { name: 'Map', component: '' },
  { name: 'System', component: '' }
]
export default {
  components: { Circle, MenuBag },
  setup () {
    const index = ref(null)
    const selected = computed(() => menu[index.value])
    const select = (i, pointer) => {
      pointer.isDown = false
      index.value = index.value === i ? null : i
    }
    return {
      menu,
      index,
      selected,
      select
    }
  }
}
</script>

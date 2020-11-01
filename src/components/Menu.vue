<template>
  <div>
    <Circle v-for="(v, i) in menu" :key="i" :fillColor="0xBBAA88" :radius="25" :x="(220).byRight + (i * 60)" :y="(40).byBottom" @pointerdown="p => select(i, p)" />
    <MenuContainer v-if="selected" :arrowX="24 + (index * 60)" :height="selected.height" :title="selected.name">
      <!-- <component :is="menu[0].component" /> -->
      <Circle :fillColor="0x0000ff" :radius="25" :x="30" :y="56" />
    </MenuContainer>
  </div>
</template>

<script>
import { Circle } from 'phavuer'
import MenuContainer from '@/components/MenuContainer'
import { computed, ref } from 'vue'
const menu = [
  { name: 'Status', component: 'MenuStatus', height: 300 },
  { name: 'Bag', component: '', height: 415 },
  { name: 'Map', component: '', height: 300 },
  { name: 'System', component: '', height: 300 }
]
export default {
  components: { Circle, MenuContainer },
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

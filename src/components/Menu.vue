<template>
  <div>
    <Circle v-for="(v, i) in menu" :key="i" :fillColor="0xBBAA88" :radius="25" :x="(220).byRight + (i * 60)" :y="(40).byBottom" />
    <component :is="menu[0].component" />
  </div>
</template>

<script>
import { Circle } from 'phavuer'
import MenuStatus from '@/components/MenuStatus'
const menu = [
  { component: 'MenuStatus' },
  { component: '' },
  { component: '' },
  { component: '' }
]
export default {
  components: { Circle, MenuStatus },
  setup () {
    return {
      menu
    }
  }
}
</script>

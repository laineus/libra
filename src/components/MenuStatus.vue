<template>
  <MenuContainer :arrowX="25 + (0 * 64)" :height="320" :title="'Status'">
    <template v-for="(v, i) in LIST.slice(0, 3)" :key="i">
      <Text :x="10" :y="10 + (i * 20)" :text="v.label" :style="{ fontSize: 15, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
      <Text :x="115" :y="10 + (i * 20)" :text="v.value.value" :style="{ fontSize: 15, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    </template>
    <template v-for="(v, i) in LIST.slice(3)" :key="i">
      <Text :x="10" :y="240 + (i * 20)" :text="v.label" :style="{ fontSize: 15, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
      <Text :x="150" :y="240 + (i * 20)" :text="v.value.value" :style="{ fontSize: 15, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    </template>
  </MenuContainer>
</template>

<script>
import { inject, computed } from 'vue'
import { Text } from 'phavuer'
import MenuContainer from '@/components/MenuContainer'
import config from '@/data/config'
import maps from '@/data/maps'
const secToMinSecString = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
export default {
  components: { Text, MenuContainer },
  setup () {
    const storage = inject('storage')
    const LIST = [
      { label: 'Libra', value: computed(() => `HP ${storage.state.status.hp}/100`) },
      { label: 'Location', value: computed(() => maps[storage.state.map]?.name) },
      { label: 'PlayTime', value: computed(() => secToMinSecString(storage.state.sec)) },
      { label: 'Charm of Heart', value: computed(() => storage.state.status.heart) },
      { label: 'Charm of Body', value: computed(() => storage.state.status.body) },
      { label: 'Sum of Charm', value: computed(() => storage.state.status.heart + storage.state.status.body) }
    ]
    return {
      COLORS: config.COLORS,
      LIST
    }
  }
}
</script>

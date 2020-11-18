<template>
  <MenuContainer :arrowX="25 + (0 * 64)" :height="350" :title="'Status'">
    <template v-for="(v, i) in LIST.slice(0, 3)" :key="i">
      <Text :x="10" :y="10 + (i * 20)" :text="v.label" />
      <Text :x="115" :y="10 + (i * 20)" :text="v.value.value" />
    </template>
    <Image texture="libra" :tint="COLORS.brown" :x="115" :y="165" :frame="Math.abs(charmDiff)" :flipX="charmDiff < 0" />
    <template v-for="(v, i) in LIST.slice(3)" :key="i">
      <Text :x="10" :y="270 + (i * 20)" :text="v.label" />
      <Text :x="150" :y="270 + (i * 20)" :text="v.value.value" />
    </template>
  </MenuContainer>
</template>

<script>
import { inject, computed } from 'vue'
import { Image } from 'phavuer'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import config from '@/data/config'
import maps from '@/data/maps'
const secToMinSecString = sec => {
  const s = sec % 60
  const m = Math.floor(sec / 60) % 60
  const h = Math.floor(sec / 3600)
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
export default {
  components: { Text, Image, MenuContainer },
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
    const charmDiff = computed(() => Math.fix(storage.state.status.heart - storage.state.status.body, -6, 6))
    return {
      COLORS: config.COLORS,
      LIST,
      charmDiff
    }
  }
}
</script>

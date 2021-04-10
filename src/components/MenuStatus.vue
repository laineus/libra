<template>
  <MenuContainer :arrowX="20 + (0 * 50) + 4" :height="360" :title="t('ui.status')">
    <template v-for="(v, i) in LIST.slice(0, 3)" :key="i">
      <Text :x="10" :y="10 + (i * 20)" :size="14" :bold="true" :text="v.label" />
      <Text :x="115" :y="10 + (i * 20)" :size="14" :text="v.value.value" />
    </template>
    <Image texture="libra" :tint="COLORS.brown" :x="115" :y="165" :frame="Math.abs(charmDiff)" :flipX="charmDiff < 0" :scale="0.9" />
    <template v-for="(v, i) in LIST.slice(3)" :key="i">
      <Text :x="15" :y="270 + (i * 20)" :size="14" :bold="true" :text="v.label" />
      <Text :x="140" :y="270 + (i * 20)" :size="14" :text="v.value.value" />
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
      { label: t('name.libra'), value: computed(() => `HP ${storage.state.status.hp}/100`) },
      { label: t('ui.location'), value: computed(() => maps[storage.state.map]?.name) },
      { label: t('ui.playTime'), value: computed(() => secToMinSecString(storage.state.sec)) },
      { label: t('ui.charmOfHeart'), value: computed(() => storage.state.status.heart) },
      { label: t('ui.charmOfBody'), value: computed(() => storage.state.status.body) },
      { label: t('ui.sumOfCharm'), value: computed(() => storage.state.status.heart + storage.state.status.body) }
    ]
    const charmDiff = computed(() => Math.fix(storage.state.status.heart - storage.state.status.body, -6, 6))
    return {
      t,
      COLORS: config.COLORS,
      LIST,
      charmDiff
    }
  }
}
</script>

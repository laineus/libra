<template>
  <div>
    <Circle v-for="(v, i) in menu" :key="i" :fillColor="0xBBAA88" :radius="25" :x="(220).byRight + (i * 60)" :y="(40).byBottom" @pointerdown="p => onTap(i, p)" />
    <template v-if="selected">
      <MenuStatus v-if="selected.key === 'status'" :ref="menu[0].ref" @close="index = null" />
      <MenuBag v-else-if="selected.key === 'bag'" :ref="menu[1].ref" @close="index = null" />
    </template>
  </div>
</template>

<script>
import { Circle } from 'phavuer'
import MenuBag from '@/components/MenuBag'
import { computed, nextTick, ref } from 'vue'
export default {
  components: { Circle, MenuBag },
  setup () {
    const menu = [
      { key: 'status', ref: ref(null) },
      { key: 'bag', ref: ref(null) },
      { key: 'map', ref: ref(null) },
      { key: 'system', ref: ref(null) }
    ]
    const index = ref(null)
    const selected = computed(() => menu[index.value])
    const select = indexOrName => {
      const i = typeof indexOrName === 'string' ? menu.findIndex(v => v.key === indexOrName) : indexOrName
      index.value = index.value === i ? null : i
      return new Promise(resolve => {
        nextTick(() => {
          resolve(selected.value?.ref.value)
        })
      })
    }
    const onTap = (i, pointer) => {
      pointer.isDown = false
      select(i)
    }
    return {
      menu,
      index,
      onTap,
      selected,
      select
    }
  }
}
</script>

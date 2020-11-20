<template>
  <div>
    <Container v-for="(v, i) in menu" :key="i" :x="(220).byRight + (i * 60)" :y="(40).byBottom">
      <Circle :fillColor="COLORS.brown" :radius="25" :lineWidth="2" :strokeColor="COLORS.soy" @pointerdown="(...args) => tapButton(i, ...args)" />
      <Image texture="menu_icons" :frame="i" :tint="COLORS.soy" :scale="1" />
    </Container>
    <template v-if="selected">
      <Container :depth="-1" :x="config.WIDTH.half" :y="config.HEIGHT.half" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="tapCloseArea" />
      <MenuStatus v-if="selected.key === 'status'" :ref="menu[0].ref" @close="index = null" />
      <MenuBag v-else-if="selected.key === 'bag'" :ref="menu[1].ref" @close="index = null" />
      <MenuMap v-else-if="selected.key === 'map'" :ref="menu[2].ref" @close="index = null" />
      <MenuSystem v-else-if="selected.key === 'system'" :ref="menu[3].ref" @close="index = null" />
    </template>
  </div>
</template>

<script>
import { computed, nextTick, ref } from 'vue'
import { Container, Circle, Image } from 'phavuer'
import config from '@/data/config'
import MenuStatus from '@/components/MenuStatus'
import MenuBag from '@/components/MenuBag'
import MenuMap from '@/components/MenuMap'
import MenuSystem from '@/components/MenuSystem'
export default {
  components: { Container, Circle, Image, MenuStatus, MenuBag, MenuMap, MenuSystem },
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
      index.value = typeof indexOrName === 'string' ? menu.findIndex(v => v.key === indexOrName) : indexOrName
      return new Promise(resolve => {
        nextTick(() => {
          resolve(selected.value?.ref.value)
        })
      })
    }
    const close = () => {
      index.value = null
    }
    const tapButton = (i, pointer, _x, _y, e) => {
      e.stopPropagation()
      pointer.isDown = false
      index.value === i ? close() : select(i)
    }
    const tapCloseArea = pointer => {
      pointer.isDown = false
      close()
    }
    return {
      config, COLORS: config.COLORS,
      menu,
      index, selected,
      select,
      tapButton, tapCloseArea
    }
  }
}
</script>

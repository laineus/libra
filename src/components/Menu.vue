<template>
  <div>
    <Container v-for="(v, i) in menu" :key="i" :x="(235).byRight + (i * 50)" :y="(35).byBottom">
      <template v-if="v.key === 'map' && onMistelyCircle">
        <Circle :fillColor="COLORS.dark" :radius="20" :lineWidth="2" :strokeColor="0x9ee50c" @pointerdown.stop="(...args) => tapButton(i, ...args)" />
        <Image texture="menu_icons" :frame="5" :tint="0x9ee50c" />
      </template>
      <template v-else>
        <Circle :fillColor="COLORS.brown" :radius="20" :lineWidth="2" :strokeColor="COLORS.soy" @pointerdown.stop="(...args) => tapButton(i, ...args)" />
        <Image texture="menu_icons" :frame="i" :tint="COLORS.soy" />
      </template>
    </Container>
    <template v-if="selected">
      <Container :depth="-1" :x="config.WIDTH.half" :y="config.HEIGHT.half" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="tapCloseArea" />
      <MenuStatus v-if="selected.key === 'status'" :ref="menu[0].ref" @close="index = null" />
      <MenuBag v-else-if="selected.key === 'bag'" :ref="menu[1].ref" @close="index = null" v-model:redecorate="redecorate" />
      <MenuQuest v-else-if="selected.key === 'quest'" :ref="menu[2].ref" @close="index = null" />
      <MenuMap v-else-if="selected.key === 'map'" :ref="menu[3].ref" @close="index = null" />
      <MenuSystem v-else-if="selected.key === 'system'" :ref="menu[4].ref" @close="index = null" />
    </template>
  </div>
</template>

<script>
import { computed, nextTick, ref, inject, provide } from 'vue'
import { Container, Circle, Image } from 'phavuer'
import config from '@/data/config'
import MenuStatus from '@/components/MenuStatus'
import MenuBag from '@/components/MenuBag'
import MenuQuest from '@/components/MenuQuest'
import MenuMap from '@/components/MenuMap'
import MenuSystem from '@/components/MenuSystem'
export default {
  components: { Container, Circle, Image, MenuStatus, MenuBag, MenuQuest, MenuMap, MenuSystem },
  setup () {
    const state = inject('storage').state
    const event = inject('event')
    const audio = inject('audio')
    const menu = [
      { key: 'status', ref: ref(null) },
      { key: 'bag', ref: ref(null) },
      { key: 'quest', ref: ref(null) },
      { key: 'map', ref: ref(null) },
      { key: 'system', ref: ref(null) }
    ]
    const index = ref(null)
    const selected = computed(() => menu[index.value])
    const select = indexOrName => {
      if (event.state) return
      audio.se('click')
      index.value = typeof indexOrName === 'string' ? menu.findIndex(v => v.key === indexOrName) : indexOrName
      return new Promise(resolve => {
        nextTick(() => {
          resolve(selected.value?.ref.value)
        })
      })
    }
    const close = () => {
      if (index.value === null) return
      index.value = null
      audio.se('cancel')
    }
    const tapButton = (i, pointer) => {
      pointer.isDown = false
      index.value === i ? close() : select(i)
    }
    const tapCloseArea = pointer => {
      pointer.isDown = false
      close()
    }
    const onMistelyCircle = computed(() => {
      return state.map === 'coalmine3' && Math.abs(935 - state.x) < 80 && Math.abs(650 - state.y) < 80
    })
    provide('onMistelyCircle', onMistelyCircle)
    const redecorate = ref(false)
    return {
      onMistelyCircle,
      config, COLORS: config.COLORS,
      menu,
      index, selected,
      select, close,
      tapButton, tapCloseArea,
      redecorate
    }
  }
}
</script>

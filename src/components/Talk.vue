<template>
  <Container :x="0" :y="0" v-if="current">
    <Rectangle :origin="0" :width="config.WIDTH" :height="config.HEIGHT" @pointerdown="next" />
    <Container :x="x" :y="y">
      <Rectangle ref="bg" :origin="0.5" :fillColor="0x222222" :alpha="0.8" :width="bgWidth" :height="bgHeight" :displayOriginX="bgWidth.half" :displayOriginY="bgHeight.half" />
      <Text ref="name" :text="current.chara.name" :style="{ fontSize: 15, fontStyle: 'bold', color: '#FFFFFF', stroke: '#111111', strokeThickness: 3 }" :originX="0" :originY="1" :x="-bgWidth.half + 8" :y="-bgHeight.half + 8" />
      <Text ref="txt" :text="current.text" :style="{ fontSize: 14, fontStyle: 'normal', color: '#FFFFFF' }" :origin="0.5" />
    </Container>
  </Container>
</template>

<script>
import { refObj, Container, Rectangle, Text } from 'phavuer'
import { computed, ref, inject, onUpdated, reactive, toRefs } from 'vue'
import config from '@/data/config'
export default {
  components: { Container, Rectangle, Text },
  setup () {
    // inject
    const camera = inject('camera')
    // refs
    const bg = refObj()
    const txt = refObj()
    // data
    const list = ref([])
    const current = computed(() => list.value[0])
    let resolver = null
    const data = reactive({
      x: computed(() => current.value?.chara.x - camera.value?.scrollX),
      y: computed(() => current.value?.chara.y - camera.value?.scrollY - 70),
      bgWidth: 0,
      bgHeight: 0
    })
    const setTalk = array => {
      if (resolver) resolver()
      list.value.splice(0)
      return new Promise(resolve => {
        list.value.push(...array)
        resolver = resolve
      })
    }
    const next = (pointer) => {
      pointer.isDown = false
      list.value.splice(0, 1)
      if (!list.value.length && resolver) resolver()
    }
    onUpdated(() => {
      if (!current.value) return
      data.bgWidth = Math.max(txt.value.width + 20, 100)
      data.bgHeight = txt.value.height + 20
    })
    return {
      config,
      current,
      next,
      setTalk,
      bg, txt,
      ...toRefs(data)
    }
  }
}
</script>

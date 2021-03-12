<template>
  <Container :x="22" :y="79">
    <Container v-for="(v, i) in list" :key="v.id" :y="i * 27">
      <Rectangle :originX="0" :originY="0.5" :width="(v.refText.value?.width ?? 0) + 14" :height="22" :fillColor="config.COLORS.black" :alpha="0.5" />
      <Text :ref="v.refText" :originX="0" :originY="0.5" :text="v.text" :x="7" :size="12" color="white" />
    </Container>
  </Container>
</template>

<script>
import { onBeforeUnmount, shallowReactive } from 'vue'
import { refObj, Container, Rectangle } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
export default {
  components: { Container, Rectangle, Text },
  setup () {
    let lastId = 0
    const list = shallowReactive([])
    const push = (...textList) => {
      textList.forEach(text => {
        list.splice(10)
        list.unshift({ id: lastId, text, refText: refObj(null), time: 100 })
        lastId++
      })
    }
    const timer = setInterval(() => {
      list.forEach(v => v.time -= 1)
      const i = list.findIndex(v => v.time <= 0)
      if (i !== -1) list.splice(i)
    }, 100)
    onBeforeUnmount(() => clearInterval(timer))
    return {
      config,
      list,
      push
    }
  }
}
</script>

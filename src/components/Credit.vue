<template>
  <Container>
    <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :fillColor="config.COLORS.black" :origin="0" />
    <Container v-for="(v, i) in list" :key="i" :x="config.WIDTH.half" :y="list.slice(0, i).sum(v => v.names.length * 30) + (i * 120)">
      <Text :text="`- ${v.title} -`" :origin="0.5" color="white" />
      <Text v-for="(name, i2) in v.names" :key="i2" :text="name" :size="19" :origin="0.5" color="white" :y="30 + i2 * 30" />
    </Container>
  </Container>
</template>

<script>
import { Container, Rectangle } from 'phavuer'
import Text from '@/components/Text'
import config from '@/data/config'
export default {
  components: { Container, Rectangle, Text },
  setup () {
    return {
      config,
      list: [
        { title: 'Written by', names: ['Laineus'] },
        { title: 'Graphics by', names: ['Laineus'] },
        { title: 'Music by', names: ['Laineus', 'Miku Hatsune'] },
        { title: 'Developed by', names: ['Laineus'] }
      ]
    }
  }
}
</script>

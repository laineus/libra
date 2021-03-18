<template>
  <Container :y="pos.y">
    <Rectangle :width="config.WIDTH" :height="5000" :fillColor="config.COLORS.black" :origin="0" @wheel="p => pos.y -= p.deltaY" />
    <Container :x="config.WIDTH.half">
      <Container v-for="(v, i) in list" :key="i" :y="list.slice(0, i).sum(v => v.names.length * 40) + (i * 180) + config.HEIGHT">
        <Text :text="`- ${v.title} -`" :originX="0.5" color="white" />
        <Text v-for="(name, i2) in v.names" :key="i2" :text="name" :size="19" :originX="0.5" color="white" :y="40 + i2 * 40" />
      </Container>
      <!-- Site -->
      <Text text="- Official Web site -" :originX="0.5" color="white" :y="1700" />
      <Image texture="banner_libra" :y="1760" />
      <Text text="https://dream-libra.laineus.com" :originX="0.5" color="white" :y="1800" />
      <!-- Site -->
      <Image texture="phaser3" :y="2200" />
      <Image texture="tiled" :y="2500" />
      <Image texture="phavuer" :y="2800" />
      <Image texture="drive_l" :y="3600" />
    </Container>
  </Container>
</template>

<script>
import { inject, reactive } from 'vue'
import { Container, Rectangle, Image, onPreUpdate } from 'phavuer'
import Text from '@/components/Text'
import config from '@/data/config'
export default {
  components: { Container, Rectangle, Image, Text },
  setup () {
    const audio = inject('audio')
    const pos = reactive({ y: 0 })
    audio.setBgm('happy_end')
    // audio.currentBgm.setSeek(88)
    onPreUpdate(() => {
      const progress = Math.min(audio.currentBgm.seek / 90, 1)
      pos.y = Math.round(3350 * -progress)
    })
    return {
      pos,
      config,
      list: [
        { title: 'Written by', names: ['Laineus'] },
        { title: 'Graphics by', names: ['Laineus'] },
        { title: 'Music by', names: ['Laineus', 'Miku Hatsune'] },
        { title: 'Developed by', names: ['Laineus'] },
        { title: 'Theme song', names: ['『ハッピーエンド』'] }
      ]
    }
  }
}
</script>

<template>
  <Container>
    <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :fillColor="config.COLORS.black" :origin="0" :tween="data.blackTween" :alpha="0" />
    <!-- Debug:  @wheel="p => currentBgm.seek += (p.deltaY / 20)" -->
    <Container :x="config.WIDTH.half" :y="data.creditY" :tween="data.creditTween">
      <Container v-for="(v, i) in list" :key="i" :y="list.slice(0, i).sum(v => v.names.length * 40) + (i * 230) + config.HEIGHT">
        <Text :text="`- ${v.title} -`" :originX="0.5" color="white" />
        <Text v-for="(name, i2) in v.names" :key="i2" :text="name" :size="19" :originX="0.5" color="white" :y="40 + i2 * 40" />
      </Container>
      <!-- Site -->
      <Text text="- Official Web site -" :originX="0.5" color="white" :y="2480" />
      <Image texture="banner_libra" :y="2560" />
      <Text text="https://libra.laineus.com" :originX="0.5" color="white" :y="2620" />
      <!-- Site -->
      <Image texture="phaser3" :y="2890" />
      <Image texture="phavuer" :y="3190" />
      <Image texture="drive_l" :y="3790" />
    </Container>
    <Container :x="config.WIDTH.half" :y="config.HEIGHT.half">
      <Container>
        <Image v-if="data.ssTexture" :texture="data.ssTexture" :origin="0.5" :tween="data.ssTween" :alpha="0" />
      </Container>
      <Container :tween="data.bedTween" :alpha="0">
        <Image :texture="endA ? 'ed_a' : 'ed_b'" :origin="0.5" />
        <Image v-if="endA" texture="ed_tear" :x="-0.5" :y="-13" :origin="0.5" :frame="animFrame" />
        <Image v-else texture="ed_zzz" :x="-0.5" :y="-30" :origin="0.5" :frame="animFrame" :tint="config.COLORS.gray" />
      </Container>
    </Container>
    <Image :texture="logoName" :x="config.WIDTH.half" :y="config.HEIGHT.half - 20" :origin="0.5" :scale="0.8" :tween="data.logoTween" :alpha="0" />
    <Text :text="data.lyrics" :origin="ja ? 0.5 : 1" :x="(ja ? 45 : 25).byRight" :y="ja ? config.HEIGHT.half : (20).byBottom" color="white" :size="14" />
  </Container>
</template>

<script>
import { inject, reactive, computed } from 'vue'
import { Container, Rectangle, Image, onPreUpdate } from 'phavuer'
import Text from '@/components/Text'
import config from '@/data/config'
import useFrameAnim from '@/components/modules/useFrameAnim'
const LYRICS_MAP = [
  [1.58], [8.45], [15.15], [22, 28.84],
  [42.71], [49.56], [56.4], [63.15],
  [70.10], [76.94],
  [83.26], [89.86], [96.71], [103.46, 110.55],
  [111.26], [118.16, 125.08],
  [138.73], [145.58],
  [151.94], [158.45], [165.35], [172.14, 179.23],
  [179.83], [186.71, 195.05]
]
export default {
  components: { Container, Rectangle, Image, Text },
  props: {
    endA: { type: Boolean, default: true }
  },
  emits: ['completed'],
  setup (props, context) {
    const FIRST_CHORUS = 82
    const OUTRO = 9
    const SS = 7
    const setting = inject('setting')
    const audio = inject('audio')
    const tweens = {
      alpha0: { alpha: 0, duration: 1000 },
      alpha1: { alpha: 1, duration: 1000 }
    }
    const ja = setting.state.lang === 'ja'
    const lyrics = t('happyend.lyrics').map(v => ja ? v.split('').join('\n').replace('ー', '｜') : v)
    const lyricsMap = LYRICS_MAP.map((v, i) => {
      return { start: v[0], end: v[1] ?? LYRICS_MAP[i + 1]?.[0] ?? v[0] + 3 }
    })
    audio.setBgm('happyend_ed', { loop: false })
    // audio.currentBgm.setSeek(20)
    audio.currentBgm.pause()
    const data = reactive({
      seek: 0,
      blackTween: Object.assign(tweens.alpha1, { onComplete: () => audio.currentBgm.resume() }),
      creditY: computed(() => {
        const progress = Math.min(data.seek / (FIRST_CHORUS - 8), 1)
        return Math.round(3530 * -progress)
      }),
      creditTween: computed(() => data.seek >= FIRST_CHORUS - 2 ? tweens.alpha0 : null),
      ssProgress: computed(() => Math.max((data.seek - FIRST_CHORUS) / (audio.currentBgm.duration - OUTRO - FIRST_CHORUS), 0)),
      ssTween: computed(() => {
        const currentProgress = ((SS * data.ssProgress) % 1)
        return currentProgress < 0.06 || currentProgress > 0.94 ? tweens.alpha0 : tweens.alpha1
      }),
      ssTexture: computed(() => {
        if (!data.ssProgress) return null
        const n = Math.floor(SS * data.ssProgress) + 1
        if (n > SS) return null
        return `ed_ss${n}`
      }),
      bedTween: computed(() => data.seek > FIRST_CHORUS && data.seek < (audio.currentBgm.duration - 2) ? tweens.alpha1 : tweens.alpha0),
      logoTween: null,
      lyricsIndex: computed(() => lyricsMap.findIndex(v => data.seek >= v.start && data.seek < v.end)),
      lyrics: computed(() => lyrics[data.lyricsIndex])
    })
    audio.currentBgm.once('complete', async () => {
      await sleep(4000)
      data.logoTween = tweens.alpha1
      await sleep(7000)
      data.logoTween = tweens.alpha0
      await sleep(3000)
      context.emit('completed')
    })
    const { play: playAnim, frame: animFrame } = useFrameAnim(props.endA ? { frames: (8).toArray(), duration: 27 } : { frames: (16).toArray(), duration: 13 })
    onPreUpdate(() => {
      if (!audio.currentBgm) return
      data.seek = audio.currentBgm.seek
      playAnim()
    })
    const title = t('happyend.title')
    const getLogoName = () => {
      if (setting.state.lang === 'ja') return 'logo_ja'
      if (setting.state.lang === 'cn') return 'logo_cn'
      if (setting.state.lang === 'es') return 'logo_es'
      return 'logo_en'
    }
    return {
      data,
      logoName: getLogoName(),
      ja,
      animFrame,
      tweens,
      config,
      currentBgm: audio.currentBgm,
      list: [
        { title: 'Written by', names: ['Laineus'] },
        { title: 'Graphics by', names: ['Laineus'] },
        { title: 'Music by', names: ['Laineus', 'KAFU & Miku Hatsune'] },
        { title: 'Developed by', names: ['Laineus'] },
        { title: 'Theme song', names: [ja ? `『${title}』` : `"${title}"`] },
        { title: 'Simplified Chinese translations by', names: ['Yuriatelier'] },
        { title: 'Spanish translations by', names: ['Kinae Wolf'] }
      ]
    }
  }
}
</script>

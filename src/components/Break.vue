<template>
  <div>
    <Image
      v-for="(frame, i) in frames"
      :key="frame.name"
      :texture="texture"
      :frame="frame.name"
      :origin="0"
      :x="(frame.width * scale * -splitCount.half) + ((i % splitCount) * frame.width * scale)"
      :y="(frame.height * scale * -splitCount) + (Math.floor(i / splitCount) * frame.height * scale)"
      :scale="scale"
      :tween="tweens[i]"
    />
  </div>
</template>

<script>
import { inject, reactive, ref, watch } from 'vue'
import { Image } from 'phavuer'
const splitFrame = (texture, frame, count) => {
  const sum = count * count
  if (texture.has(`${frame}_0`)) {
    return sum.toArray().map(i => texture.get(`${frame}_${i}`))
  }
  const base = texture.get(frame)
  const width = Math.round(base.cutWidth / count)
  const height = Math.round(base.cutHeight / count)
  const x = base.cutX
  const y = base.cutY
  return sum.toArray().map(i => {
    const localX = (i % count) * width
    const localY = Math.floor(i / count) * height
    return texture.add(`${frame}_${i}`, 0, x + localX, y + localY, width, height)
  })
}
export default {
  components: { Image },
  props: {
    texture: { default: null },
    initialFrame: { default: null },
    scale: { default: null }
  },
  emits: ['broken'],
  setup (props, context) {
    const splitCount = 3
    const scene = inject('scene')
    const texture = scene.textures.get(props.texture)
    const baseFrame = texture.get(props.initialFrame)
    const frames = splitFrame(texture, props.initialFrame, splitCount)
    const broken = ref(false)
    watch(broken, () => context.emit('broken'))
    const tweens = reactive((splitCount * splitCount).toArray().map(i => {
      const r = Math.randomInt(-0.5, 0.5)
      const xSeed = (((i % splitCount) / (splitCount - 1)) - 0.5) * 2
      const x = Math.randomInt(-baseFrame.width * props.scale, baseFrame.width * props.scale) * xSeed
      return {
        x: x * 0.7, y: '-=5',
        ease: Phaser.Math.Easing.Quadratic.Out,
        rotation: r,
        duration: 120,
        onComplete: () => {
          tweens[i] = {
            x: x,
            y: 0,
            rotation: r * 3,
            ease: Phaser.Math.Easing.Quadratic.In,
            duration: 250,
            onComplete: () => {
              tweens[i] = {
                alpha: 0,
                y: '+=6',
                duration: 300,
                onComplete: () => broken.value = true
              }
            }
          }
        }
      }
    }))
    return {
      frames,
      splitCount,
      tweens
    }
  }
}
</script>

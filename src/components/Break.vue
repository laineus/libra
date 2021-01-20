<template>
  <div>
    <Image
      v-for="(frame, i) in frames"
      :key="frame.name"
      :texture="texture"
      :frame="frame.name"
      :origin="0"
      :x="(frame.width * -splitCount.half) + ((i % splitCount) * frame.width)"
      :y="(frame.height * -splitCount) + (Math.floor(i / splitCount) * frame.height)"
      :tween="tweens[i]"
    />
  </div>
</template>

<script>
import { inject, reactive } from 'vue'
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
    initialFrame: { default: null }
  },
  setup (props) {
    const splitCount = 3
    const scene = inject('scene')
    const textures = scene.textures.get(props.texture)
    const frames = splitFrame(textures, props.initialFrame, splitCount)
    const tweens = reactive((splitCount * splitCount).toArray().map(i => {
      const r = Math.randomInt(-1.5, 1.5)
      return {
        x: Math.randomInt(-45, 45),
        y: '-=5',
        ease: Phaser.Math.Easing.Quadratic.Out,
        rotation: r,
        duration: 60,
        onComplete: () => {
          tweens[i] = {
            y: 0,
            rotation: r.twice,
            ease: Phaser.Math.Easing.Quadratic.In,
            duration: 200
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

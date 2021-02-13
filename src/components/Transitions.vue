<template>
  <Rectangle v-for="v in transitions" :key="v.id" :fillColor="v.color" :origin="0" :width="config.WIDTH" :height="config.HEIGHT" :depth="v.depth" :alpha="v.alpha" />
</template>

<script>
import { inject, shallowReactive } from 'vue'
import { Rectangle } from 'phavuer'
import config from '@/data/config'
export default {
  components: { Rectangle },
  setup () {
    const scene = inject('scene')
    const transitions = shallowReactive([])
    const getTransitionTween = target => (duration, { alpha, hold, destroy, depth }) => {
      return new Promise(resolve => {
        const onComplete = () => {
          if (destroy) transitions.delete(target)
          sleep(hold).then(resolve)
        }
        return scene.add.tween({ targets: target, duration, alpha, onComplete })
      })
    }
    const add = (duration = 500, { alpha = 1, hold, color = config.COLORS.black, depth = config.DEPTH.TRANSITION } = {}) => {
      hold = hold ?? duration.half
      const data = shallowReactive({ id: Symbol('id'), color, depth, alpha: 0 })
      transitions.push(data)
      const tween = getTransitionTween(data)
      return tween(duration, { alpha, hold, destroy: false }).then(() => {
        const nextTween = (...args) => tween(args[0] ?? duration, Object.assign({ alpha: 0, hold: 0, destroy: true }, args[1])).then(() => nextTween)
        return nextTween
      })
    }
    return {
      config,
      transitions,
      add
    }
  }
}
</script>

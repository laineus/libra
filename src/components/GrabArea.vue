<template>
  <Container ref="container" :depth="100000" :x="data.x" :y="data.y" @pointerdown="grab">
    <Image v-if="!noImage" texture="hand_catch" :x="10" :alpha="data.grabbing ? 1 : 0.5" :tint="data.grabbing ? 0xFF0000 : config.COLORS.white" :tween="data.grabbing ? null : handTween" />
  </Container>
</template>

<script>
import { useScene, Container, Image, onPreUpdate, refObj } from 'phavuer'
import { inject, reactive, shallowReactive } from 'vue'
import config from '@/data/config'
import tappedNearest from '@/components/modules/tappedNearest'
export default {
  components: { Container, Image },
  props: {
    follow: { default: null },
    name: { default: null },
    scale: { default: null },
    noImage: { default: false }
  },
  emits: ['grab', 'capture', 'cancel', 'move'],
  setup (props, context) {
    const scene = useScene()
    const menu = inject('menu')
    const container = refObj(null)
    const data = shallowReactive({
      x: 0, y: 0, grabbing: false
    })
    const handTween = reactive({ x: 13, y: 3, yoyo: true, repeat: -1, duration: 700, onStop: v => v.seek(0) })
    const grab = (pointer) => {
      if (pointer.button !== 0) return
      if (scene.input._temp.length && !tappedNearest(scene.input._temp, pointer, container.value)) return
      menu.value.select('bag')?.then(menuBag => {
        data.grabbing = true
        context.emit('grab')
        const mode = menu.value.redecorate ? 'move' : 'capture'
        menuBag.grabItem({ key: props.name, scale: props.scale }, mode, pointer).then(pos => {
          data.grabbing = false
          if (!pos) {
            context.emit('cancel')
          } else if (pos.delete) {
            context.emit('capture')
          } else {
            context.emit(mode, pos)
          }
        })
      })
    }
    onPreUpdate(() => {
      if (props.follow) {
        data.x = props.follow.x
        data.y = props.follow.y
      }
    })
    return {
      container,
      config,
      data,
      handTween,
      grab
    }
  }
}
</script>

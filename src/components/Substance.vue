<template>
  <div>
    <Container ref="object" :x="initX" :y="initY" :width="imgWidth" :height="imgWidth" :depth="depth" @create="create" @preUpdate="update">
      <Image ref="image" :texture="texture" :originX="0.5" :originY="1" :alpha="alpha" :pipeline="pipeline" v-if="texture" />
    </Container>
    <TapArea v-if="tapEvent.event.value" :visible="checkable" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @tap="tapEvent.exec" />
    <GrabArea v-else-if="capture" :visible="grabbable" :texture="texture" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @grab="alpha = 0.5" @capture="$emit('del')" @cancel="alpha = 1" />
  </div>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { computed, inject, reactive, ref, toRefs } from 'vue'
import TapArea from './TapArea'
import GrabArea from './GrabArea'
import useEvent from './modules/useEvent'
export default {
  components: { Container, Image, TapArea, GrabArea },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    texture: { default: null },
    capture: { default: true },
    pipeline: { default: null }
  },
  emits: ['create', 'preUpdate', 'del'],
  setup (props, context) {
    const event = inject('event')
    const player = inject('player')
    const object = refObj(null)
    const image = refObj(null)
    const imgWidth = computed(() => image.value ? image.value.width : 30)
    const imgHeight = computed(() => image.value ? image.value.height : 30)
    const depth = ref(0)
    const alpha = ref(1)
    const tapEvent = useEvent()
    const data = reactive({
      distanceToPlayer: null
    })
    const create = obj => context.emit('create', obj)
    const update = obj => {
      if (depth.value !== obj.y) depth.value = obj.y
      data.distanceToPlayer = Phaser.Math.Distance.Between(object.value.x, object.value.y, player.value.object.x, player.value.object.y)
      context.emit('preUpdate', obj)
    }
    return {
      ...toRefs(data),
      checkable: computed(() => !event.state && tapEvent.event.value && data.distanceToPlayer < 150),
      grabbable: computed(() => !event.state && data.distanceToPlayer < 150),
      create, update,
      object, image,
      imgWidth, imgHeight, depth, alpha,
      tapEvent,
      execTapEvent: tapEvent.exec,
      setTapEvent: tapEvent.setEvent
    }
  }
}
</script>

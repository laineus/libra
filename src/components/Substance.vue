<template>
  <div>
    <Container ref="object" :visible="unref(visible)" :x="initX" :y="initY" :width="imgWidth" :height="imgWidth" :depth="depth" @create="create" @preUpdate="update">
      <Image ref="image" :texture="imageTexture" :originX="0.5" :originY="1" :alpha="alpha" :pipeline="pipeline" v-if="imageTexture" />
    </Container>
    <TapArea v-if="tapEvent.event.value" :visible="unref(visible) && checkable" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @tap="tapEvent.exec" />
    <GrabArea v-else-if="capturable" :visible="unref(visible) && grabbable" :name="name" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @grab="alpha = 0.5" @capture="$emit('del')" @cancel="alpha = 1" />
  </div>
</template>

<script>
import { refObj, Container, Image } from 'phavuer'
import { computed, inject, reactive, ref, toRefs, unref } from 'vue'
import items from '@/data/items'
import TapArea from './TapArea'
import GrabArea from './GrabArea'
import useEvent from './modules/useEvent'
export default {
  components: { Container, Image, TapArea, GrabArea },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    name: { default: null },
    texture: { default: null },
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
      visible: true,
      capturable: Boolean(props.name),
      distanceToPlayer: null
    })
    const setVisible = bool => data.visible = bool
    const setCapturable = bool => data.capturable = bool
    const itemData = items.find(v => v.key === props.name)
    const imageTexture = computed(() => props.texture || itemData?.texture)
    const create = obj => context.emit('create', obj)
    const update = obj => {
      if (depth.value !== obj.y) depth.value = obj.y
      data.distanceToPlayer = Phaser.Math.Distance.Between(object.value.x, object.value.y, player.value.object.x, player.value.object.y)
      context.emit('preUpdate', obj)
    }
    return {
      unref,
      ...toRefs(data),
      checkable: computed(() => !event.state && tapEvent.event.value && data.distanceToPlayer < 150),
      grabbable: computed(() => !event.state && data.distanceToPlayer < 150),
      create, update,
      object, image,
      imageTexture,
      imgWidth, imgHeight, depth, alpha,
      tapEvent,
      execTapEvent: tapEvent.exec,
      setTapEvent: tapEvent.setEvent,
      setVisible, setCapturable
    }
  }
}
</script>

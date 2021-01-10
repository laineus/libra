<template>
  <div>
    <Container ref="object" :visible="unref(visible)" :x="initX" :y="initY" :width="imgWidth" :height="imgWidth" :depth="depth" :tween="tween" @create="create" @preUpdate="update">
      <Image ref="image" v-if="imageTexture" :texture="imageTexture" :originX="0.5" :originY="1" :alpha="alpha" :tint="tint" :pipeline="pipeline" />
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
import config from '@/data/config'
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
    const itemData = items.find(v => v.key === props.name)
    const imageTexture = computed(() => props.texture || itemData?.texture)
    const data = reactive({
      visible: true,
      tint: config.COLORS.white,
      tween: null,
      capturable: Boolean(props.name),
      distanceToPlayer: null,
      hp: itemData?.hp ?? 10
    })
    const setVisible = bool => data.visible = bool
    const setCapturable = bool => data.capturable = bool
    const drop = () => {
      return new Promise(resolve => {
        const x = ['-=5', '+=5'].random()
        data.tween = {
          x, y: '-=5',
          duration: 100,
          onComplete: (v) => {
            data.tween = {
              x, y: '+=13',
              duration: 100,
              onComplete: () => resolve()
            }
          }
        }
      })
    }
    const damage = () => {
      data.hp -= Math.randomInt(3, 7)
      if (data.hp >= 0) return
      data.tint = 0xFF7777
      data.tween = {
        scale: 1.5, alpha: 0,
        duration: 250,
        onComplete: () => {
          data.tween = null
          context.emit('del')
        }
      }
    }
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
      drop, damage,
      object, image,
      imageTexture,
      imgWidth, imgHeight, depth, alpha,
      tapEvent,
      execTapEvent: tapEvent.exec,
      setTapEvent: tapEvent.setEvent,
      setVisible, setCapturable,
      destroy: () => context.emit('del')
    }
  }
}
</script>

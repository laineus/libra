<template>
  <div>
    <Container ref="object" :visible="unref(visible)" :x="initX" :y="initY" :width="imgWidth" :height="imgWidth" :depth="depth" :tween="tween" @create="create">
      <template v-if="imageTexture">
        <Image v-if="hp > 0" ref="image" :texture="imageTexture" :frame="frame" :originX="0.5" :originY="1" :scale="scale" :alpha="alpha" :pipeline="pipeline" />
        <Break v-else :texture="imageTexture" :initialFrame="frame" @broken="$emit('del')" />
      </template>
      <slot />
    </Container>
    <TapArea v-if="tapEvent.event.value" :visible="unref(visible) && checkable" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @tap="tapEvent.exec" />
    <GrabArea v-else-if="capturable" :visible="unref(visible) && grabbable" :name="name" :scale="scale" :width="imgWidth + 15" :height="imgHeight + 40" :follow="object" @grab="alpha = 0.5" @capture="$emit('del')" @cancel="alpha = 1" />
  </div>
</template>

<script>
import { refObj, Container, Image, onPreUpdate } from 'phavuer'
import { computed, inject, reactive, ref, toRefs, unref } from 'vue'
import items from '@/data/items'
import TapArea from './TapArea'
import GrabArea from './GrabArea'
import Break from './Break'
import useEvent from './modules/useEvent'
export default {
  components: { Container, Image, TapArea, GrabArea, Break },
  props: {
    initX: { default: 0 },
    initY: { default: 0 },
    scale: { default: 1 },
    name: { default: null },
    texture: { default: null },
    pipeline: { default: null },
    frame: { default: '__BASE' }
  },
  emits: ['create', 'del'],
  setup (props, context) {
    const field = inject('field')
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
      if (data.hp <= 0) return
      data.hp -= Math.randomInt(3, 7)
      if (data.hp >= 0) return
      if (itemData?.drop) {
        itemData.drop.filter(v => Math.chance(v.chance)).forEach(v => {
          field.value.dropItem(v.key, object.value)
        })
      }
    }
    const create = obj => context.emit('create', obj)
    onPreUpdate(() => {
      if (depth.value !== object.value.y) depth.value = object.value.y
      data.distanceToPlayer = Phaser.Math.Distance.Between(object.value.x, object.value.y, player.value.object.x, player.value.object.y)
    })
    return {
      unref,
      ...toRefs(data),
      checkable: computed(() => !event.state && tapEvent.event.value && data.distanceToPlayer < 150),
      grabbable: computed(() => !event.state && data.distanceToPlayer < 150),
      create,
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

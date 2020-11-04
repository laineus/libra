<template>
  <MenuContainer :arrowX="24 + (1 * 60)" :height="415" :title="'Bag'" :visible="!grab.dispose">
    <Container :x="5" :y="26 + 5" @preUpdate="update" ref="object">
      <Rectangle fillColor="0xFF0000" :alpha="0.5" :origin="0" :width="220" :height="405" />
      <Image v-for="v in items" :key="v.id" :ref="v.ref" :texture="`chara_sprite/${v.key}`" :x="v.bagX" :y="v.bagY" :origin="0.5" :visible="toRaw(grab.item) !== v" @pointerdown="p => grabItem(p, v)" />
    </Container>
  </MenuContainer>
  <Image v-if="grab.item" :texture="`chara_sprite/${grab.item.key}`" :x="grab.x" :y="grab.y" :origin="0.5" @pointerup="p => drop(p)" />
</template>

<script>
import { Container, Image, refObj, Rectangle } from 'phavuer'
import { inject, computed, reactive, toRaw } from 'vue'
import MenuContainer from '@/components/MenuContainer'
const WIDTH = 220
const HEIGHT = 405
export default {
  components: { Container, Image, MenuContainer, Rectangle },
  emits: ['close'],
  setup (_, context) {
    const storage = inject('storage')
    const controller = inject('controller').value
    const camera = inject('camera').value
    const field = inject('field').value
    const object = refObj(null)
    const offsetX = computed(() => object.value?.x + object.value?.parentContainer.x)
    const offsetY = computed(() => object.value?.y + object.value?.parentContainer.y)
    const grab = reactive({
      item: null,
      dispose: false,
      x: 0, y: 0
    })
    const items = computed(() => storage.state.items.map(v => Object.assign({ ref: refObj(null), original: v }, v)))
    const grabItem = (pointer, item) => {
      grab.item = item
      grab.x = pointer.x
      grab.y = pointer.y
    }
    const update = () => {
      if (grab.item && controller.activePointer) {
        grab.x = controller.activePointer.x
        grab.y = controller.activePointer.y
        if (grab.dispose) {
          if (Phaser.Math.Distance.Between(grab.x, grab.y, (160).byRight, (40).byBottom) < 20)  grab.dispose = false
        } else {
          if ((grab.x - offsetX.value) < 0) grab.dispose = true
        }
      }
    }
    const drop = (pointer) => {
      const wHalf = grab.item.ref.width.half
      const hHalf = grab.item.ref.height.half
      if (grab.dispose) {
        field.addObject({ type: 'Substance', name: 'flower', x: grab.x + camera.scrollX, y: grab.y + camera.scrollY + hHalf })
        storage.state.items.delete(grab.item.original)
        context.emit('close')
      } else {
        grab.item.original.bagX = Math.fix(pointer.x - offsetX.value, wHalf, WIDTH - wHalf)
        grab.item.original.bagY = Math.fix(pointer.y - offsetY.value, hHalf, HEIGHT - hHalf)
      }
      grab.item = null
    }
    return {
      toRaw,
      items,
      object,
      controller, grab,
      grabItem, update, drop
    }
  }
}
</script>

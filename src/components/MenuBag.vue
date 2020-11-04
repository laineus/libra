<template>
  <MenuContainer :arrowX="24 + (1 * 60)" :height="415" :title="'Bag'" :visible="!grab.dispose">
    <Container :x="5" :y="26 + 5" @preUpdate="update" ref="object">
      <Rectangle fillColor="0xFF0000" :alpha="0.5" :origin="0" :width="220" :height="405" />
      <Image v-for="v in items" :key="v.id" :texture="`chara_sprite/${v.key}`" :x="v.bagX" :y="v.bagY" :origin="0.5" :visible="grab.item !== v" @pointerdown="p => grabItem(p, v)" />
    </Container>
  </MenuContainer>
  <Image v-if="grab.item" :texture="`chara_sprite/${grab.item.key}`" :x="grab.x" :y="grab.y" :origin="0.5" @pointerup="p => drop(p)" />
</template>

<script>
import { Container, Image, refObj, Rectangle } from 'phavuer'
import { inject, computed, reactive } from 'vue'
import MenuContainer from '@/components/MenuContainer'
// const WIDTH = 220
// const HEIGHT = 405
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
    const items = storage.state.items
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
      if (grab.dispose) {
        field.addObject({ type: 'Substance', name: 'flower', x: grab.x + camera.scrollX, y: grab.y + camera.scrollY })
        items.delete(grab.item)
        context.emit('close')
      } else {
        grab.item.bagX = pointer.x - offsetX.value
        grab.item.bagY = pointer.y - offsetY.value
      }
      grab.item = null
    }
    return {
      items,
      object,
      controller, grab,
      grabItem, update, drop
    }
  }
}
</script>

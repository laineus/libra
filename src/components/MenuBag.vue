<template>
  <MenuContainer ref="container" :arrowX="25 + (0 * 60)" :height="415" :title="t('ui.bag')" :visible="grab.mode !== 'dispose'">
    <Image v-for="v in bagItems" :key="v.id" :texture="keyToTexture(v.key)" :frame="keyToFrame(v.key)" :x="v.bagX" :y="v.bagY" :scale="v.scale" :origin="0.5" :visible="grab.item !== v" @pointerdown="grabItem(v, 'move')" />
  </MenuContainer>
  <Image v-if="grab.item" ref="grabRef" :texture="keyToTexture(grab.item.key)" :frame="keyToFrame(grab.item.key)" :x="grab.x" :y="grab.y" :scale="grab.item.scale" :origin="0.5" @pointerup="p => drop(p)" />
</template>

<script>
import { Image, refObj, onPreUpdate } from 'phavuer'
import { inject, computed, reactive, ref } from 'vue'
import MenuContainer from '@/components/MenuContainer'
import items from '@/data/items'
const keyToItemData = key => items.find(v => v.key === key)
const keyToTexture = key => keyToItemData(key).texture
const keyToFrame = key => keyToItemData(key).type === 'Character' ? 1 : '__BASE'
const WIDTH = 220
const HEIGHT = 405
export default {
  components: { Image, MenuContainer },
  emits: ['close'],
  setup (_, context) {
    const storage = inject('storage')
    const controller = inject('controller').value
    const camera = inject('camera').value
    const field = inject('field').value
    const container = ref(null)
    const offsetX = computed(() => container.value?.offsetX)
    const offsetY = computed(() => container.value?.offsetY)
    const grab = reactive({
      item: null,
      mode: null,
      resolver: null,
      x: 0, y: 0
    })
    const onBagArea = computed(() => (grab.x - offsetX.value) >= 0)
    const grabRef = refObj(null)
    const update = () => {
      if (grab.item) {
        if (!controller.activePointer) return drop()
        grab.x = controller.activePointer.x
        grab.y = controller.activePointer.y
        if (grab.mode === 'move') {
          if (!onBagArea.value) grab.mode = 'dispose'
        } else if (grab.mode === 'dispose') {
          if (Phaser.Math.Distance.Between(grab.x, grab.y, (160).byRight, (40).byBottom) < 20) grab.mode = 'move'
        }
      }
    }
    onPreUpdate(update)
    const grabItem = (item, mode) => {
      grab.item = item
      grab.mode = mode
      if (grab.resolver) grab.resolver()
      const promise = new Promise(resolve => {
        grab.resolver = resolve
      })
      update()
      return promise
    }
    const drop = pointer => {
      const wHalf = grabRef.value.width.half
      const hHalf = grabRef.value.height.half
      if (grab.mode === 'dispose') {
        const itemData = keyToItemData(grab.item.key)
        field.addObject({ type: itemData.type, name: itemData.key, x: grab.x + camera.scrollX, y: grab.y + camera.scrollY + hHalf * (grab.item.scale ?? 1), scale: grab.item.scale })
        storage.state.bagItems.delete(grab.item)
        grab.resolver()
        context.emit('close')
      } else if (grab.mode === 'move') {
        grab.item.bagX = Math.round(Math.fix(pointer.x - offsetX.value, wHalf, WIDTH - wHalf))
        grab.item.bagY = Math.round(Math.fix(pointer.y - offsetY.value, hHalf, HEIGHT - hHalf))
        grab.resolver()
      } if (grab.mode === 'capture') {
        if (onBagArea.value) {
          storage.state.bagItems.push({
            id: Math.randomInt(1000000, 9999999),
            key: grab.item.key,
            scale: grab.item.scale,
            bagX: Math.round(Math.fix(pointer.x - offsetX.value, wHalf, WIDTH - wHalf)),
            bagY: Math.round(Math.fix(pointer.y - offsetY.value, hHalf, HEIGHT - hHalf))
          })
          grab.resolver(true)
        } else {
          grab.resolver(false)
        }
        context.emit('close')
      }
      grab.item = null
      grab.resolver = null
    }
    return {
      t,
      keyToTexture, keyToFrame,
      bagItems: storage.state.bagItems,
      container,
      controller, grab, grabRef,
      grabItem, drop
    }
  }
}
</script>

<template>
  <MenuContainer ref="container" :arrowX="25 + (0 * 60)" :height="415" :title="t('ui.bag')" :visible="grab.mode !== 'dispose'">
    <Image v-for="v in bagItems" :key="v.id" :texture="itemData[v.key].texture" :frame="itemData[v.key].frame" :x="v.bagX" :y="v.bagY" :scale="v.scale" :origin="0.5" :visible="grab.item !== v" @pointerdown="grabItem(v, 'move')" />
    <Text :text="`${t('ui.weight')}:`" :originX="1" :originY="0.5" :x="153" :y="14" :size="13" />
    <Text :text="`${weight}/100`" :originX="1" :originY="0.5" :x="212" :y="14" :size="14" />
    <Image v-if="grab.item && itemData[grab.item.key].eat" :tint="onEatArea ? config.COLORS.orange : config.COLORS.brown" texture="eat" :origin="1" :x="212" :y="398" />
  </MenuContainer>
  <Container v-if="grab.item" :x="grab.x" :y="grab.y">
    <Image ref="grabRef" :texture="itemData[grab.item.key].texture" :frame="itemData[grab.item.key].frame" :scale="grab.item.scale" :origin="0.5" @pointerup="p => drop(p)" />
    <Text v-if="grabRef" :text="grabItemName" :originX="0.5" :originY="1" :size="10" :y="-grabRef.height.half - 8" :style="{ stroke: config.COLORS.soy.toColorString, strokeThickness: 2 }" />
  </Container>
</template>

<script>
import { Image, Container, refObj, onPreUpdate } from 'phavuer'
import { inject, computed, reactive, ref } from 'vue'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import config from '@/data/config'
import items from '@/data/items'
const itemData = items.toObject(v => [v.key, v])
const WIDTH = 220
const HEIGHT = 405
export default {
  components: { Image, Container, MenuContainer, Text },
  emits: ['close'],
  setup (_, context) {
    const storage = inject('storage')
    const uiScene = inject('uiScene').value
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
    const grabItemName = computed(() => itemData[grab.item.key].type === 'Character' ? t(`name.${grab.item.key}`) : t(`item.${grab.item.key}`))
    const onEatArea = computed(() => Math.hypot(grab.x - 907, grab.y - 418) < 25)
    const onBagArea = computed(() => (grab.x - offsetX.value) >= 0)
    const weight = computed(() => storage.state.bagItems.reduce((sum, v) => sum + itemData[v.key].weight, 0))
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
      const data = itemData[grab.item.key]
      if (data.eat && onEatArea.value) {
        storage.state.status.hp = Math.min(storage.state.status.hp + data.eat, 100)
        storage.state.bagItems.delete(grab.item)
        storage.state.stomach.push(data.key)
        uiScene.log.push(t('ui.eat', t(`item.${data.key}`)))
        uiScene.log.push(t('ui.hpRecover', data.eat))
        grab.resolver(true)
        context.emit('close')
      } else if (grab.mode === 'dispose') {
        const x = grab.x + camera.scrollX
        const y = grab.y + camera.scrollY + hHalf * (grab.item.scale ?? 1)
        const onCeil = field.field.tilemap.layers.some(l => l.tilemapLayer.depth >= config.DEPTH.CEIL && l.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
        if (onCeil) {
          uiScene.log.push(t('ui.cantPutItem'))
        } else {
          field.addObject({ id: Math.randomInt(1000000, 9999999), name: data.key, x, y, scale: grab.item.scale })
          storage.state.bagItems.delete(grab.item)
          context.emit('close')
        }
        grab.resolver()
      } else if (grab.mode === 'move') {
        grab.item.bagX = Math.round(Math.fix(pointer.x - offsetX.value, wHalf, WIDTH - wHalf))
        grab.item.bagY = Math.round(Math.fix(pointer.y - offsetY.value, hHalf, HEIGHT - hHalf))
        grab.resolver()
      } else if (grab.mode === 'capture') {
        const weightOver = (weight.value + data.weight) > 100
        if (onBagArea.value && !weightOver) {
          storage.state.bagItems.push({
            id: Math.randomInt(1000000, 9999999),
            key: grab.item.key,
            scale: grab.item.scale,
            bagX: Math.round(Math.fix(pointer.x - offsetX.value, wHalf, WIDTH - wHalf)),
            bagY: Math.round(Math.fix(pointer.y - offsetY.value, hHalf, HEIGHT - hHalf))
          })
          grab.resolver(true)
          sleep(30).then(() => context.emit('close'))
        } else {
          if (onBagArea.value && weightOver) uiScene.log.push(t('ui.weightOver'))
          grab.resolver(false)
          context.emit('close')
        }
      }
      grab.mode = null
      grab.item = null
      grab.resolver = null
    }
    return {
      t, config,
      itemData,
      weight,
      bagItems: storage.state.bagItems,
      container,
      controller, grab, grabRef,
      grabItem, drop,
      grabItemName,
      onEatArea
    }
  }
}
</script>

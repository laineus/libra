<template>
  <MenuContainer ref="container" :arrowX="20 + (1 * 50)" :height="420" :title="t('ui.bag')" :visible="showBag">
    <Image v-for="v in bagItems" :key="v.id" :texture="itemData[v.key].texture" :frame="itemData[v.key].frame" :x="v.bagX" :y="v.bagY" :scale="v.scale" :originX="0.5" :originY="1" :visible="grab.item !== v" @pointerdown="grabItem(v, 'move')" />
    <Text :text="`${t('ui.weight')}:`" :originX="1" :originY="0.5" :x="163" :y="14" :size="13" />
    <Text :text="`${weight}/100`" :originX="1" :originY="0.5" :x="222" :y="14" :size="14" />
    <Image v-if="grab.item && itemData[grab.item.key].eat" :tint="onEatArea ? config.COLORS.orange : config.COLORS.brown" texture="eat" :origin="1" :x="222" :y="402" />
    <template v-if="field.name === 'home'">
      <Text :text="t('ui.redecorate')" :origin="1" :x="212" :y="-11" :size="13" color="soy" :bold="true" :style="{ stroke: config.COLORS.brown.toColorString, strokeThickness: 2 }" @pointerdown.stop="$emit('update:redecorate', !redecorate)" />
      <Image :x="236" :y="-10" :origin="1" texture="check" :frame="redecorate ? 1 : 0" :tint="config.COLORS.soy" @pointerdown.stop="$emit('update:redecorate', !redecorate)" />
    </template>
  </MenuContainer>
  <Container v-if="grab.item" :x="grab.x" :y="grab.y">
    <Image ref="grabRef" :texture="itemData[grab.item.key].texture" :frame="itemData[grab.item.key].frame" :scale="grab.item.scale" :originX="0.5" :originY="1" @pointerup="drop" />
    <Text v-if="grabRef" :text="grabItemName" :originX="0.5" :originY="1" :size="10" :y="-grabRef.height - 8" :style="{ stroke: config.COLORS.soy.toColorString, strokeThickness: 2 }" />
  </Container>
</template>

<script>
import { Image, Container, refObj, onPreUpdate } from 'phavuer'
import { inject, computed, reactive, ref } from 'vue'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import config from '@/data/config'
import items from '@/data/items'
import makeRaptor from '@/components/modules/makeRaptor'
const itemData = items.toObject(v => [v.key, v])
const WIDTH = 230
const HEIGHT = 410
export default {
  components: { Image, Container, MenuContainer, Text },
  props: ['redecorate'],
  emits: ['close', 'update:redecorate'],
  setup (_, context) {
    const storage = inject('storage')
    const uiScene = inject('uiScene').value
    const controller = inject('controller').value
    const camera = inject('camera').value
    const field = inject('field').value
    const mobile = inject('mobile')
    const container = ref(null)
    const offsetX = computed(() => container.value?.offsetX)
    const offsetY = computed(() => container.value?.offsetY)
    const grab = reactive({
      item: null,
      mode: null,
      resolver: null,
      x: 0, y: 0
    })
    const grabbingBagItem = computed(() => 'bagX' in grab.item)
    const grabItemName = computed(() => itemData[grab.item.key].type === 'Character' ? t(`name.${grab.item.key}`) : t(`item.${grab.item.key}`))
    const onEatArea = computed(() => Math.hypot(grab.x - 907, grab.y - 422) < 25)
    const onBagArea = computed(() => (grab.x - offsetX.value) >= 0)
    const weight = computed(() => storage.state.bagItems.reduce((sum, v) => sum + itemData[v.key].weight, 0))
    const grabRef = refObj(null)
    const showBag = computed(() => {
      if (grab.mode === 'dispose') return false
      if (grab.mode === 'move' && !grabbingBagItem.value) return false
      return true
    })
    if (field.name !== 'home') context.emit('update:redecorate', false)
    const update = () => {
      if (grab.item) {
        if (!controller.activePointer) return drop()
        grab.x = controller.activePointer.x
        grab.y = controller.activePointer.y
        if (grab.mode === 'move' && grabbingBagItem.value) {
          if (!onBagArea.value) grab.mode = 'dispose'
        } else if (grab.mode === 'dispose') {
          if (Phaser.Math.Distance.Between(grab.x, grab.y, (180).byRight, (35).byBottom) < 20) grab.mode = 'move'
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
    const onCeil = (x, y) => field.field.tilemap.layers.some(l => l.tilemapLayer.depth >= config.DEPTH.CEIL && l.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
    const drop = () => {
      const width = grabRef.value.width
      const height = grabRef.value.height
      const wHalf = width.half
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
        const y = grab.y + camera.scrollY
        const trashCan = field.objects.find(o => ['trashCan1', 'trashCan2'].includes(o.name) && Phaser.Math.Distance.Between(o.x, o.y, x, y) < 20)
        if (onCeil(x, y)) {
          uiScene.log.push(t('ui.cantPutItem'))
        } if (['tissueEmpty', 'trash'].includes(data.key) && trashCan) {
          storage.state.bagItems.delete(grab.item)
          if (trashCan.name === 'trashCan1') {
            const i = field.objects.findIndex(v => v === trashCan)
            field.objects.splice(i, 1, Object.assign({}, trashCan, { name: 'trashCan2' }))
            if (field.name === 'home') {
              const stateTrashCan = storage.state.roomItems.find(v => v.key === 'trashCan1' && v.x === trashCan.x && v.y === trashCan.y)
              stateTrashCan.key = 'trashCan2'
            }
          }
          context.emit('close')
          uiScene.log.push(t('ui.trash'))
        } else {
          field.addObject({ id: Math.randomInt(1000000, 9999999), name: data.key, x, y, scale: grab.item.scale })
          storage.state.bagItems.delete(grab.item)
          context.emit('close')
        }
        grab.resolver()
      } else if (grab.mode === 'move') {
        const x = grab.x + camera.scrollX
        const y = grab.y + camera.scrollY
        if (grabbingBagItem.value) {
          grab.item.bagX = Math.round(Math.fix(grab.x - offsetX.value, wHalf, WIDTH - wHalf))
          grab.item.bagY = Math.round(Math.fix(grab.y - offsetY.value, height, HEIGHT))
        }
        if (grab.item.key.startsWith('raptor')) {
          makeRaptor(storage.state.bagItems, uiScene)
        }
        if (grabbingBagItem.value) {
          grab.resolver({ x, y })
        } else {
          context.emit('close')
          grab.resolver(onCeil(x, y) ? null : { x, y })
        }
      } else if (grab.mode === 'capture') {
        const weightOver = (weight.value + data.weight) > 100
        if (onBagArea.value && !weightOver) {
          storage.state.bagItems.push({
            id: Math.randomInt(1000000, 9999999),
            key: grab.item.key,
            scale: grab.item.scale,
            bagX: Math.round(Math.fix(grab.x - offsetX.value, wHalf, WIDTH - wHalf)),
            bagY: Math.round(Math.fix(grab.y - offsetY.value, height, HEIGHT))
          })
          grab.resolver(true)
          sleep(30).then(() => context.emit('close'))
          if (['gun', 'revolver', 'rifle'].includes(grab.item.key)) {
            uiScene.setTutorial(mobile ? 'gunSp' : 'gunPc')
          } else if (weight.value >= 60) {
            uiScene.setTutorial('weight')
          }
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
      field,
      t, config,
      itemData,
      weight,
      showBag,
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

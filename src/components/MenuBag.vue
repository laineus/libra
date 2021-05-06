<template>
  <MenuContainer ref="container" :height="395" :title="t('ui.bag')" :visible="showBag">
    <Image texture="menu_arrow" :x="68" :y="399" :rotation="-0.05" :tint="config.COLORS.soy" />
    <Image v-for="v in bagItems" :key="v.id" :texture="itemData[v.key].texture" :frame="itemData[v.key].frame" :x="v.bagX" :y="v.bagY" :scale="v.scale" :originX="0.5" :originY="1" :visible="grab.item !== v" @pointerdown="grabItem(v, 'move', $event)" @create="createdItem" />
    <Text :text="`${t('ui.weight')}:`" :originX="1" :originY="0.5" :x="163" :y="-3" :size="12" />
    <Text :text="`${weight}/100`" :originX="1" :originY="0.5" :x="221" :y="-3" :size="13" :bold="warning" :color="warning ? 'red' : undefined" />
    <Image v-if="grab.item && itemData[grab.item.key].eat" :tint="onEatArea ? config.COLORS.orange : config.COLORS.brown" texture="eat" :origin="1" :x="229" :y="375" />
    <template v-if="field.name === 'home'">
      <Text :text="t('ui.redecorate')" :origin="1" :x="212" :y="-31" :size="13" color="soy" :bold="true" :style="{ stroke: config.COLORS.brown.toColorString, strokeThickness: 2 }" @pointerdown.stop="switchRedecorate" />
      <Image :x="236" :y="-30" :origin="1" texture="check" :frame="redecorate ? 1 : 0" :tint="config.COLORS.soy" @pointerdown.stop="switchRedecorate" />
    </template>
  </MenuContainer>
  <Container v-if="grab.item" :x="grab.x" :y="grab.y">
    <Image ref="grabRef" :texture="itemData[grab.item.key].texture" :frame="itemData[grab.item.key].frame" :scale="grab.item.scale" :originX="0.5" :originY="1" />
    <Text v-if="grabRef" :text="grabItemName" :originX="0.5" :originY="1" :size="10" :y="-grabRef.height - 8" :style="{ stroke: config.COLORS.soy.toColorString, strokeThickness: 2 }" />
  </Container>
</template>

<script>
import { Image, Container, refObj, onPreUpdate } from 'phavuer'
import { inject, computed, reactive, ref, nextTick, onBeforeUnmount } from 'vue'
import MenuContainer from '@/components/MenuContainer'
import Text from '@/components/Text'
import config from '@/data/config'
import items from '@/data/items'
import makeRaptor from '@/components/modules/makeRaptor'
const itemData = items.toObject(v => [v.key, v])
const WIDTH = 240
const HEIGHT = 390
export default {
  components: { Image, Container, MenuContainer, Text },
  props: ['redecorate'],
  emits: ['close', 'update:redecorate'],
  setup (props, context) {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const controller = inject('controller').value
    const camera = inject('camera').value
    const field = inject('field').value
    const mobile = inject('mobile')
    const audio = inject('audio')
    const achieve = inject('achieve')
    const bag = inject('bag')
    const container = ref(null)
    const offsetX = computed(() => container.value?.offsetX)
    const offsetY = computed(() => container.value?.offsetY)
    const grab = reactive({
      item: null,
      mode: null,
      pointer: null,
      resolver: null,
      x: 0, y: 0
    })
    const grabbingBagItem = computed(() => 'bagX' in grab.item)
    const grabItemName = computed(() => itemData[grab.item.key].type === 'Character' ? t(`name.${grab.item.key}`) : t(`item.${grab.item.key}`))
    const onEatArea = computed(() => Math.hypot(grab.x - 909, grab.y - 410) < 25)
    const onBagArea = computed(() => (grab.x - offsetX.value) >= 0)
    const weight = computed(() => state.bagItems.reduce((sum, v) => sum + itemData[v.key].weight, 0))
    const grabRef = refObj(null)
    const showBag = computed(() => {
      if (grab.mode === 'dispose') return false
      if (grab.mode === 'move' && !grabbingBagItem.value) return false
      return true
    })
    if (field.name !== 'home') context.emit('update:redecorate', false)
    const sortItems = () => {
      nextTick(() => {
        container.value?.container.sort('y')
      })
    }
    const thumbAdjust = mobile ? -60 : 0
    const update = () => {
      if (grab.item) {
        if (!grab.pointer.active || !grab.pointer.isDown) return drop()
        grab.x = grab.pointer.x
        grab.y = grab.pointer.y
        if (grab.mode === 'move' && grabbingBagItem.value) {
          if (!onBagArea.value) grab.mode = 'dispose'
        } else if (grab.mode === 'dispose') {
          if (Phaser.Math.Distance.Between(grab.x, grab.y - thumbAdjust, (180).byRight, (35).byBottom) < 20) grab.mode = 'move'
        }
      }
    }
    onPreUpdate(update)
    const grabItem = (item, mode, pointer) => {
      grab.item = item
      grab.mode = mode
      grab.pointer = pointer
      if (grab.resolver) grab.resolver()
      const promise = new Promise(resolve => {
        grab.resolver = resolve
      })
      update()
      return promise
    }
    const onCeil = (x, y) => field.field.tilemap.layers.some(l => l.tilemapLayer.depth >= config.DEPTH.CEIL && l.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
    const trashCan = (x, y) => {
      if (!['tissueEmpty', 'trash'].includes(grab.item.key)) return false
      const trashCan = field.substances.find(o => ['trashCan1', 'trashCan2'].includes(o.name) && Phaser.Math.Distance.Between(o.ref.value.object.x, o.ref.value.object.y, x, y) < 20)
      if (!trashCan) return false
      state.bagItems.delete(grab.item)
      if (trashCan.name === 'trashCan1') {
        const i = field.objects.findIndex(v => v === trashCan)
        field.objects.splice(i, 1, Object.assign({}, trashCan, { name: 'trashCan2' }))
        if (field.name === 'home') {
          const stateTrashCan = state.roomItems.find(v => v.key === 'trashCan1' && v.x === trashCan.x && v.y === trashCan.y)
          stateTrashCan.key = 'trashCan2'
        }
      }
      uiScene.log.push(t('ui.trash'))
      achieve.activate('trash')
      audio.se('drop')
      return true
    }
    const drop = () => {
      const width = grabRef.value.width
      const height = grabRef.value.height
      const wHalf = width.half
      const data = itemData[grab.item.key]
      if (data.eat && onEatArea.value) {
        state.status.hp = Math.min(state.status.hp + data.eat, 100)
        state.bagItems.delete(grab.item)
        state.stomach.push(data.key)
        uiScene.log.push(t('ui.eat', t(`item.${data.key}`)))
        uiScene.log.push(t('ui.hpRecover', data.eat))
        audio.se('effect')
        grab.resolver(true)
        context.emit('close')
      } else if (grab.mode === 'dispose') {
        const x = grab.x + camera.scrollX
        const y = grab.y + camera.scrollY
        const vendingMachine = field.substances.find(o => o.name === 'vendingMachine' && Phaser.Math.Distance.Between(o.ref.value.object.x, o.ref.value.object.y - 30, x, y) < 28)
        if (onCeil(x, y)) {
          uiScene.log.push(t('ui.cantPutItem'))
        } else if (trashCan(x, y)) {
          state.bagItems.delete(grab.item)
          context.emit('close')
        } else if (['coinGold', 'coinSilver'].includes(data.key) && vendingMachine) {
          state.bagItems.delete(grab.item)
          field.dropItem(['coke', 'tea'].random(), vendingMachine.ref.value.object)
          context.emit('close')
          uiScene.log.push(t('ui.vendingMachine'))
          achieve.activate('drink')
        } else {
          field.addObject({ id: Math.randomInt(1000000, 9999999), name: data.key, x, y, scale: grab.item.scale })
          state.bagItems.delete(grab.item)
          if (grab.item.key.startsWith('raptor')) makeRaptor(true, { state, uiScene, field, achieve, audio })
          context.emit('close')
        }
        audio.se('drop')
        grab.resolver()
      } else if (grab.mode === 'move') {
        const x = grab.x + camera.scrollX
        const y = grab.y + camera.scrollY
        if (grabbingBagItem.value) {
          grab.item.bagX = Math.round(Math.fix(grab.x - offsetX.value, wHalf, WIDTH - wHalf))
          grab.item.bagY = Math.round(Math.fix(grab.y - offsetY.value, height, HEIGHT))
          grab.resolver(true)
        } else {
          if (trashCan(x, y)) {
            grab.resolver({ x, y, delete: true })
          } else {
            grab.resolver(onCeil(x, y) ? false : { x, y })
          }
          context.emit('close')
        }
        // Raptor
        const isRaptor = grab.item.key.startsWith('raptor')
        const isField = !grabbingBagItem.value
        nextTick(() => {
          if (isRaptor) makeRaptor(isField, { state, uiScene, field, achieve, audio })
        })
        sortItems()
      } else if (grab.mode === 'capture') {
        const weightOver = (weight.value + data.weight) > 100
        if (onBagArea.value && !weightOver) {
          uiScene.log.push(t('ui.pickup', grabItemName.value))
          state.bagItems.push({
            id: Math.randomInt(1000000, 9999999),
            key: grab.item.key,
            scale: grab.item.scale,
            bagX: Math.round(Math.fix(grab.x - offsetX.value, wHalf, WIDTH - wHalf)),
            bagY: Math.round(Math.fix(grab.y - offsetY.value, height, HEIGHT))
          })
          audio.se('capture')
          grab.resolver(true)
          sleep(30).then(() => context.emit('close'))
          if (['gun', 'revolver', 'rifle'].includes(grab.item.key)) {
            uiScene.setTutorial(mobile ? 'gunSp' : 'gunPc')
          } else if (weight.value >= 60) {
            uiScene.setTutorial('weight')
          }
          if (grab.item.key === 'pinkPenguin') {
            achieve.activate('pink')
          } else if (grab.item.key.startsWith('art')) {
            const names = (23).toArray().map(i => `art${i}`)
            if (names.every(name => bag.hasItem(name, 1, { bag: true, room: true }))) {
              achieve.activate('art')
            }
          }
          sortItems()
        } else {
          if (onBagArea.value && weightOver) uiScene.log.push(t('ui.weightOver'))
          grab.resolver(false)
          context.emit('close')
        }
      }
      grab.mode = null
      grab.item = null
      grab.pointer = null
      grab.resolver = null
    }
    const switchRedecorate = () => {
      context.emit('update:redecorate', !props.redecorate)
      audio.se('click')
    }
    const warning = computed(() => weight.value > 70)
    const minItemSize = mobile ? 50 : 25
    const createdItem = (item) => {
      nextTick(() => {
        if (item.input.hitArea.width < minItemSize) item.input.hitArea.width = minItemSize
        if (item.input.hitArea.height < minItemSize) item.input.hitArea.height = minItemSize
      })
    }
    onBeforeUnmount(() => {
      grab.resolver?.(false)
    })
    return {
      createdItem,
      field,
      t, config,
      itemData,
      weight, warning,
      showBag,
      bagItems: state.bagItems,
      container,
      controller, grab, grabRef,
      grabItem,
      grabItemName,
      onEatArea,
      switchRedecorate
    }
  }
}
</script>

<template>
  <MenuContainer ref="container" :height="395" :title="t('ui.bag')" :visible="showBag">
    <Image texture="menu_arrow" :x="68" :y="399" :rotation="-0.05" :tint="config.COLORS.soy" />
    <Image v-for="v in bagItems" :key="v.id" :depth="0" :texture="itemData[v.key].texture" :frame="itemData[v.key].frame" :x="v.bagX" :y="v.bagY" :scale="v.scale" :originX="0.5" :originY="1" :visible="grab.item !== v && (!gamepadMode || focusedItem !== v)" @pointerdown="grabItem(v, 'move', $event)" @create="image => createdItem(v, image)" />
    <Rectangle v-if="gamepadMode && focusedItem && focusedItemSize && grab.item !== focusedItem" :depth="1" :x="focusedItem.bagX" :y="focusedItem.bagY - focusedItemSize.height.half" :width="focusedItemSize.width + 10" :height="focusedItemSize.height + 10" :fillColor="config.COLORS.orange" :alpha="0.7" />
    <Image v-if="gamepadMode && focusedItem && grab.item !== focusedItem" :depth="2" :texture="itemData[focusedItem.key].texture" :frame="itemData[focusedItem.key].frame" :x="focusedItem.bagX" :y="focusedItem.bagY" :scale="focusedItem.scale" :originX="0.5" :originY="1" @pointerdown="grabItem(focusedItem, 'move', $event)" />
    <Text v-if="gamepadMode && focusedItem && focusedItemSize && grab.item !== focusedItem" :depth="2" :text="focusedItemName" :x="focusedItem.bagX" :y="focusedItem.bagY - focusedItemSize.height - 8" :originX="0.5" :originY="1" :size="10" :style="{ stroke: config.COLORS.soy.toColorString, strokeThickness: 2 }" />
    <Text :text="`${t('ui.weight')}:`" :originX="1" :originY="0.5" :x="163" :y="-3" :size="12" />
    <Text :text="`${weight}/100`" :originX="1" :originY="0.5" :x="221" :y="-3" :size="13" :bold="warning" :color="warning ? 'red' : undefined" />
    <Image v-if="grab.item && itemData[grab.item.key].eat" :tint="onEatArea ? config.COLORS.orange : config.COLORS.brown" texture="eat" :origin="1" :x="229" :y="375" />
    <Container v-if="field.name === 'home'" :x="168" :y="-38" :width="170" :height="45" @pointerdown.stop="switchRedecorate">
      <Text :text="t('ui.redecorate')" :originX="1" :originY="0.5" :x="46" :size="13" color="soy" :bold="true" :style="{ stroke: config.COLORS.brown.toColorString, strokeThickness: 2 }" />
      <Image :x="70" :originX="1" :originY="0.5" texture="check" :frame="redecorate ? 1 : 0" :tint="config.COLORS.soy" />
    </Container>
  </MenuContainer>
  <Container v-if="grab.item" :x="grab.x" :y="grab.y">
    <Image ref="grabRef" :texture="itemData[grab.item.key].texture" :frame="itemData[grab.item.key].frame" :scale="grab.item.scale" :originX="0.5" :originY="1" />
    <Text v-if="grabRef" :text="grabItemName" :originX="0.5" :originY="1" :size="10" :y="-grabRef.height - 8" :style="{ stroke: config.COLORS.soy.toColorString, strokeThickness: 2 }" />
  </Container>
</template>

<script>
import * as Phaser from 'phaser'
import { Image, Container, Rectangle, refPhaserInstance, onPreUpdate } from 'phavuer'
import { inject, computed, reactive, ref, nextTick, onBeforeUnmount } from 'vue'
import MenuContainer from '@/components/MenuContainer.vue'
import Text from '@/components/Text.vue'
import config from '@/data/config'
import items from '@/data/items'
import makeRaptor from '@/components/modules/makeRaptor'
const itemData = items.toObject(v => [v.key, v])
const WIDTH = 240
const HEIGHT = 390
const GAMEPAD_GRAB_SPEED = 500
let lastFocusedItemId = null
export default {
  components: { Image, Container, Rectangle, MenuContainer, Text },
  props: ['redecorate'],
  emits: ['close', 'update:redecorate'],
  setup (props, context) {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const controllerRef = inject('controller')
    const controller = controllerRef.value
    const camera = inject('camera').value
    const field = inject('field').value
    const mobile = inject('mobile')
    const audio = inject('audio')
    const achieve = inject('achieve')
    const bag = inject('bag')
    const container = ref(null)
    const focusedItem = ref(state.bagItems.find(item => item.id === lastFocusedItemId) ?? state.bagItems[0] ?? null)
    const itemSizes = reactive({})
    const focusedItemSize = computed(() => itemSizes[focusedItem.value?.id])
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
    const getItemName = item => itemData[item.key].type === 'Character' ? t(`name.${item.key}`) : t(`item.${item.key}`)
    const grabItemName = computed(() => getItemName(grab.item))
    const focusedItemName = computed(() => focusedItem.value ? getItemName(focusedItem.value) : '')
    const onEatArea = computed(() => Math.hypot(grab.x - 909, grab.y - 410) < 25)
    const onBagArea = computed(() => (grab.x - offsetX.value) >= 0)
    const weight = computed(() => state.bagItems.reduce((sum, v) => sum + itemData[v.key].weight, 0))
    const grabRef = refPhaserInstance(null)
    const showBag = computed(() => {
      if (grab.mode === 'dispose') return false
      if (grab.mode === 'move' && !grabbingBagItem.value) return false
      return true
    })
    if (field.name !== 'home') context.emit('update:redecorate', false)
    const sortItems = () => {
      nextTick(() => {
        container.value?.container.list.sort((a, b) => (a.depth - b.depth) || (a.y - b.y))
      })
    }
    const thumbAdjust = mobile ? -60 : 0
    const update = (time, delta = 0) => {
      if (grab.item) {
        if (!grab.pointer.active || !grab.pointer.isDown) {
          if (!grabRef.value) return
          return drop()
        }
        if (grab.pointer.gamepad) {
          grab.pointer.x = Math.fix(grab.pointer.x + controller.rightStickX * GAMEPAD_GRAB_SPEED * delta / 1000, 0, config.WIDTH)
          grab.pointer.y = Math.fix(grab.pointer.y + controller.rightStickY * GAMEPAD_GRAB_SPEED * delta / 1000, 0, config.HEIGHT)
        }
        grab.x = grab.pointer.x
        grab.y = grab.pointer.y + thumbAdjust
        if (grab.mode === 'move' && grabbingBagItem.value) {
          if (!onBagArea.value) grab.mode = 'dispose'
        } else if (grab.mode === 'dispose') {
          if (Phaser.Math.Distance.Between(grab.x, grab.y - thumbAdjust, (180).byRight, (35).byBottom) < 20) grab.mode = 'move'
        }
      }
    }
    onPreUpdate(update)
    const grabItem = (item, mode, pointer) => {
      if ('bagX' in item) {
        focusedItem.value = item
        lastFocusedItemId = item.id
      } else {
        focusedItem.value = null
      }
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
    const navigate = ({ x, y, rawX = x, rawY = y }) => {
      if (grab.item || (!x && !y) || !state.bagItems.length) return
      if (!focusedItem.value || !state.bagItems.includes(focusedItem.value)) {
        focusedItem.value = state.bagItems[0]
        return
      }
      const current = focusedItem.value
      const inputLength = Math.hypot(rawX, rawY)
      const directionX = rawX / inputLength
      const directionY = rawY / inputLength
      const candidates = state.bagItems.filter(item => {
        if (item === current) return false
        return ((item.bagX - current.bagX) * directionX) + ((item.bagY - current.bagY) * directionY) > 0
      })
      focusedItem.value = candidates.findMin(item => {
        const dx = item.bagX - current.bagX
        const dy = item.bagY - current.bagY
        const distance = Math.hypot(dx, dy)
        const cosine = ((dx * directionX) + (dy * directionY)) / distance
        return distance * (1 + ((1 - cosine) * 8))
      }) ?? current
      lastFocusedItemId = focusedItem.value.id
    }
    const grabFocusedItem = () => {
      const item = focusedItem.value
      if (!item || grab.item) return
      const pointer = {
        active: true,
        isDown: true,
        button: 0,
        gamepad: true,
        x: offsetX.value + item.bagX,
        y: offsetY.value + item.bagY
      }
      grabItem(item, 'move', pointer)
    }
    const grabEnd = () => {
      if (grab.pointer?.gamepad) grab.pointer.isDown = false
    }
    const cancel = () => {
      if (!grab.item) return false
      grab.pointer.isDown = false
      return true
    }
    const onCeil = (x, y) => field.field.tilemap.layers.some(l => l.tilemapLayer.depth >= config.DEPTH.CEIL && l.tilemapLayer.getTileAtWorldXY(x, y)?.collides)
    const trashCan = (x, y) => {
      if (!['tissueEmpty', 'trash'].includes(grab.item.key)) return false
      const trashCan = field.substances.find(o => {
        const component = field.getObjectRef(o)
        return ['trashCan1', 'trashCan2'].includes(o.name) && component && Phaser.Math.Distance.Between(component.object.x, component.object.y, x, y) < 20
      })
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
        const vendingMachine = field.substances.find(o => {
          const component = field.getObjectRef(o)
          return o.name === 'vendingMachine' && component && Phaser.Math.Distance.Between(component.object.x, component.object.y - 30, x, y) < 28
        })
        if (onCeil(x, y)) {
          uiScene.log.push(t('ui.cantPutItem'))
        } else if (trashCan(x, y)) {
          audio.se('drop')
          state.bagItems.delete(grab.item)
          context.emit('close')
        } else if (['coinGold', 'coinSilver'].includes(data.key) && vendingMachine) {
          audio.se('drop')
          state.bagItems.delete(grab.item)
          field.dropItem(['coke', 'tea'].random(), field.getObjectRef(vendingMachine).object)
          context.emit('close')
          uiScene.log.push(t('ui.vendingMachine'))
          achieve.activate('drink')
        } else {
          audio.se('drop')
          field.addObject({ id: Math.randomInt(1000000, 9999999), name: data.key, x, y, scale: grab.item.scale })
          state.bagItems.delete(grab.item)
          if (grab.item.key.startsWith('raptor')) makeRaptor(true, { state, uiScene, field, achieve, audio })
          context.emit('close')
        }
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
          const capturedItem = {
            id: Math.randomInt(1000000, 9999999),
            key: grab.item.key,
            scale: grab.item.scale,
            bagX: Math.round(Math.fix(grab.x - offsetX.value, wHalf, WIDTH - wHalf)),
            bagY: Math.round(Math.fix(grab.y - offsetY.value, height, HEIGHT))
          }
          state.bagItems.push(capturedItem)
          focusedItem.value = capturedItem
          lastFocusedItemId = capturedItem.id
          audio.se('capture')
          grab.resolver(true)
          sleep(30).then(() => context.emit('close'))
          if (['gun', 'revolver', 'rifle'].includes(grab.item.key)) {
            uiScene.setTutorial(controller?.gamepadConnected ? 'gunGamepad' : mobile ? 'gunSp' : 'gunPc')
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
    const createdItem = (bagItem, item) => {
      itemSizes[bagItem.id] = { width: item.displayWidth, height: item.displayHeight }
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
      gamepadMode: computed(() => controllerRef.value?.gamepadMode),
      focusedItem,
      focusedItemSize,
      grabItem,
      navigate, grabFocused: grabFocusedItem, grabEnd, cancel,
      grabItemName,
      focusedItemName,
      onEatArea,
      switchRedecorate
    }
  }
}
</script>

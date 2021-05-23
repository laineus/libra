<template>
  <MenuContainer ref="container" :height="390" :title="t('ui.map')">
    <Image texture="menu_arrow" :x="168" :y="387" :rotation="-0.1" :tint="COLORS.soy" />
    <Text :text="t('events.bogusDoctor.lockMap')" :x="10" :y="10" v-if="lockInHospital" />
    <template v-else>
      <Container v-for="(v, i) in places" :key="i" :x="rowWidth.half + 10" :y="(i * rowHeight) + rowHeight.half + 5" :width="rowWidth" :height="rowHeight" @pointerdown="p => tapItem(p, i)">
        <Rectangle :visible="i === selectedIndex && !del" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
        <Line v-if="i !== places.length - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
        <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v ? `${t(`place.${v.key}`)} (${v.x}, ${v.y})` : t('ui.unregistered')" :size="13" :bold="Boolean(v)" />
        <Container v-if="v" :width="rowHeight" :height="rowHeight" :x="100" @pointerdown.stop="p => tapGarbage(p, i)">
          <Rectangle :visible="i === selectedIndex && del" :fillColor="COLORS.orange" :width="rowHeight" :height="rowHeight" :alpha="0.8" />
          <Image texture="garbage" :scale="0.45" :tint="COLORS.brown" />
        </Container>
      </Container>
      <template v-if="selectedIndex !== null">
        <Selector v-if="del" :x="tapX" :y="tapY" :list="[t('ui.delete'), t('ui.cancel')]" @select="submit" />
        <Selector v-else :x="tapX" :y="tapY" :list="[places[selectedIndex] ? t('ui.moveToRegisteredPlace') : t('ui.registerPlace'), t('ui.cancel')]" @select="submit" />
      </template>
    </template>
  </MenuContainer>
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
import { computed, inject, reactive, ref, toRefs } from 'vue'
import { Container, Rectangle, Line, Image } from 'phavuer'
import config from '@/data/config'
import Text from '@/components/Text'
import Selector from '@/components/Selector'
import { BOGUS_STEPS } from '@/data/eventSteps'
export default {
  components: { MenuContainer, Container, Rectangle, Text, Line, Image, Selector },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene').value
    const storage = inject('storage')
    const field = inject('field').value
    const player = inject('player').value
    const audio = inject('audio')
    const onMistelyCircle = inject('onMistelyCircle')
    const container = ref(null)
    const places = storage.state.places
    const data = reactive({
      rowWidth: 220, rowHeight: 37,
      selectedIndex: null,
      tapX: 0, tapY: 0,
      del: false
    })
    const onTap = del => (pointer, i) => {
      if (data.selectedIndex) {
        data.selectedIndex = null
        return
      }
      data.tapX = Math.min(pointer.x - container.value.offsetX + 5, del ? 205 : 180)
      data.tapY = pointer.y - container.value.offsetY - 10
      data.selectedIndex = i
      data.del = del
    }
    const submit = i => {
      if (i === 1) return data.selectedIndex = null
      if (data.del) {
        places[data.selectedIndex] = null
        data.selectedIndex = null
        return
      }
      const place = places[data.selectedIndex]
      if (place) {
        gameScene.setField(place.key, place.x, place.y)
        sleep(200).then(() => audio.se('effect'))
        context.emit('close')
      } else {
        if (onMistelyCircle.value) {
          places[data.selectedIndex] = { key: 'coalmine4', x: 223, y: 381 }
        } else {
          places[data.selectedIndex] = { key: field.name, x: Math.round(player.object.x), y: Math.round(player.object.y) }
        }
        data.selectedIndex = null
      }
    }
    return {
      t,
      COLORS: config.COLORS,
      places,
      container,
      ...toRefs(data),
      submit,
      tapItem: onTap(false),
      tapGarbage: onTap(true),
      lockInHospital: computed(() => [BOGUS_STEPS.STARTED, BOGUS_STEPS.SOLVED].includes(storage.state.events.bogusDoctor))
    }
  }
}
</script>

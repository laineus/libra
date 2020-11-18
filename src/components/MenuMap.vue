<template>
  <MenuContainer ref="container" :arrowX="25 + (2 * 60)" :height="305" :title="'Map'">
    <Container v-for="(v, i) in places" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => tapItem(p, i)">
      <Rectangle :visible="i === selectedIndex" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
      <Line v-if="i !== places.length - 1" :x="0" :y="rowHeight.half - 0.5" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v ? `${mapName(v.key)} (${v.x}, ${v.y})` : '未登録'" :size="13" :bold="true" />
      <Image v-if="v" texture="garbage" :scale="0.45" :tint="COLORS.brown" :x="91" @pointerdown="p => tapGarbage(p, i)" />
    </Container>
    <template v-if="selectedIndex !== null">
      <Selector v-if="del" :x="tapX" :y="tapY" :list="['削除', 'キャンセル']" @select="submit" />
      <Selector v-else :x="tapX" :y="tapY" :list="[places[selectedIndex] ? '登録した場所へ移動' : '現在地を登録', 'キャンセル']" @select="submit" />
    </template>
  </MenuContainer>
</template>

<script>
import MenuContainer from '@/components/MenuContainer'
import { inject, reactive, ref, toRefs } from 'vue'
import { Container, Rectangle, Line, Image } from 'phavuer'
import config from '@/data/config'
import maps from '@/data/maps'
import Text from '@/components/Text'
import Selector from '@/components/Selector'
export default {
  components: { MenuContainer, Container, Rectangle, Text, Line, Image, Selector },
  emits: ['close'],
  setup (_, context) {
    const gameScene = inject('gameScene').value
    const storage = inject('storage')
    const field = inject('field').value
    const player = inject('player').value
    const container = ref(null)
    const places = storage.state.places
    const data = reactive({
      rowWidth: 220, rowHeight: 37,
      selectedIndex: null,
      tapX: 0, tapY: 0,
      del: false
    })
    const onTap = del => (pointer, i) => {
      console.log(pointer)
      if (data.selectedIndex) {
        data.selectedIndex = null
        return
      }
      data.tapX = pointer.x - container.value.offsetX + 5
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
        context.emit('close')
      } else {
        places[data.selectedIndex] = { key: field.name, x: Math.round(player.object.x), y: Math.round(player.object.y) }
        data.selectedIndex = null
      }
    }
    const mapName = key => maps[key]?.name
    return {
      COLORS: config.COLORS,
      places,
      container,
      ...toRefs(data),
      submit,
      mapName,
      tapItem: onTap(false),
      tapGarbage: onTap(true)
    }
  }
}
</script>

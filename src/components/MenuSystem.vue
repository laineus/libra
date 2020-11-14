<template>
  <MenuContainer ref="container" :arrowX="25 + (3 * 60)" :height="342" :title="'System'">
    <Container v-for="(v, i) in list" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => onTap(p, i)">
      <Rectangle :visible="i === selectedIndex" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
      <Line v-if="i !== list.length - 1" :x="0" :y="rowHeight.half - 0.5" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.name" :style="{ fontSize: 13, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
      <Text v-if="v.exists" :x="-15" :y="0" :originY="0.5" :text="`${mapName(v.state.map)}\n${timeString(v.state.saved)}`" :lineSpacing="1" :style="{ fontSize: 11, fontStyle: 'bold', color: COLORS.brown.toColorString }" />
    </Container>
    <Selector v-if="selectedIndex !== null" :x="tapX" :y="tapY" :list="[list[selectedIndex].exists ? '上書き保存' : '保存', 'キャンセル']" @select="submit" />
  </MenuContainer>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { Container, Rectangle, Text, Line } from 'phavuer'
import moment from 'moment'
import SaveDataManager from '@/class/SaveDataManager'
import config from '@/data/config'
import MenuContainer from '@/components/MenuContainer'
import Selector from '@/components/Selector'
import maps from '@/data/maps'
export default {
  components: { MenuContainer, Container, Rectangle, Text, Line, Selector },
  setup () {
    const sdm = new SaveDataManager()
    const list = ref([])
    const container = ref(null)
    const data = reactive({
      rowWidth: 220, rowHeight: 37,
      selectedIndex: null,
      tapX: 0, tapY: 0
    })
    const loadData = () => {
      sdm.getList().then(v => {
        list.value = v
        console.log(list.value)
      })
    }
    loadData()
    const submit = i => {
      if (i === 1) return data.selectedIndex = null
      const row = list.value[data.selectedIndex]
      sdm.save(row.number)
      loadData()
    }
    const timeString = time => moment(time * 1000).format('YYYY-MM-DD HH:mm')
    const mapName = key => maps[key]?.name || '不明'
    return {
      COLORS: config.COLORS,
      list,
      container,
      ...toRefs(data),
      submit,
      timeString, mapName,
      onTap: (pointer, i) => {
        if (!i) return
        if (data.selectedIndex) {
          data.selectedIndex = null
          return
        }
        data.tapX = pointer.x - container.value.offsetX + 5
        data.tapY = pointer.y - container.value.offsetY - 10
        data.selectedIndex = i
      }
    }
  }
}
</script>

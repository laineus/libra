<template>
  <Container>
    <Container v-for="(v, i) in list" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => onTap(p, i)">
      <Rectangle :visible="i === selectedIndex" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
      <Line v-if="i !== list.length - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.name" :size="13" :bold="true" @pointerdown="p => onTap(p, i)" /><!-- TODO -->
      <Text v-if="v.exists" :x="-15" :y="0" :originY="0.5" :text="`${mapName(v.state.map)}\n${timeString(v.state.saved)}`" :lineSpacing="1" :size="11" />
    </Container>
    <Selector v-if="selectedIndex !== null" :x="tapX" :y="tapY" :list="[list[selectedIndex].exists ? '上書き保存' : '保存', 'キャンセル']" @select="submit" />
  </Container>
</template>

<script>
import { inject, reactive, ref, toRefs } from 'vue'
import { Container, Rectangle, Line } from 'phavuer'
import dayjs from 'dayjs'
import config from '@/data/config'
import maps from '@/data/maps'
import Text from '@/components/Text'
import Selector from '@/components/Selector'
export default {
  components: { Container, Rectangle, Text, Line, Selector },
  props: ['offsetX', 'offsetY'],
  setup (props) {
    const storage = inject('storage')
    const list = ref([])
    const data = reactive({
      rowWidth: 220, rowHeight: 37,
      selectedIndex: null,
      tapX: 0, tapY: 0
    })
    const loadData = () => {
      storage.getList().then(v => {
        list.value = v
        console.log(list.value)
      })
    }
    loadData()
    const submit = i => {
      if (i === 1) return data.selectedIndex = null
      const row = list.value[data.selectedIndex]
      storage.save(row.number)
      data.selectedIndex = null
      loadData()
    }
    const timeString = time => dayjs(time * 1000).format('YYYY-MM-DD HH:mm')
    const mapName = key => maps[key]?.name
    return {
      COLORS: config.COLORS,
      list,
      ...toRefs(data),
      submit,
      timeString, mapName,
      onTap: (pointer, i) => {
        if (!i) return
        if (data.selectedIndex) {
          data.selectedIndex = null
          return
        }
        data.tapX = pointer.x - props.offsetX + 5
        data.tapY = pointer.y - props.offsetY - 10
        data.selectedIndex = i
      }
    }
  }
}
</script>

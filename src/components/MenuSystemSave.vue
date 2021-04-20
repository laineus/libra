<template>
  <Container>
    <Container v-for="(v, i) in list" :key="i" :x="rowWidth.half" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => tapItem(p, i)">
      <Rectangle :visible="i === selectedIndex" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
      <Line v-if="i !== list.length - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.name" :size="13" :bold="true" @pointerdown="p => tapItem(p, i)" /><!-- TODO -->
      <Text v-if="v.exists" :x="-15" :y="0" :originY="0.5" :text="`${t(`place.${v.state.map}`)}\n${timeString(v.state.saved)}`" :lineSpacing="1" :size="11" />
    </Container>
    <Selector v-if="!load && selectedIndex !== null" :x="tapX" :y="tapY" :list="[list[selectedIndex].exists ? t('ui.overwriteSave') : t('ui.normalSave'), t('ui.cancel')]" @select="tapSaveOption" />
  </Container>
</template>

<script>
import { inject, reactive, ref, toRefs } from 'vue'
import { Container, Rectangle, Line } from 'phavuer'
import dayjs from 'dayjs'
import config from '@/data/config'
import Text from '@/components/Text'
import Selector from '@/components/Selector'
export default {
  components: { Container, Rectangle, Text, Line, Selector },
  props: ['offsetX', 'offsetY', 'load'],
  emits: ['load'],
  setup (props, context) {
    const storage = inject('storage')
    const gameScene = inject('gameScene')
    const uiScene = inject('uiScene').value
    const audio = inject('audio')
    const list = ref([])
    const data = reactive({
      rowWidth: 240, rowHeight: 37,
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
    const tapSaveOption = i => {
      if (i === 1) return data.selectedIndex = null
      const row = list.value[data.selectedIndex]
      audio.se('capture')
      uiScene.log.push(t('ui.saved'))
      storage.save(row.number)
      data.selectedIndex = null
      loadData()
    }
    const tapItem = async (pointer, i) => {
      if (data.selectedIndex !== null) return
      if (props.load) {
        if (!list.value[i].state) return
        audio.se('click')
        data.selectedIndex = i
        await storage.load(list.value[i].number)
        await gameScene.value.setField(storage.state.map, storage.state.x, storage.state.y, storage.state.r, { autosave: false })
        context.emit('load')
      } else {
        if (!i) return
        audio.se('click')
        if (data.selectedIndex) {
          data.selectedIndex = null
          return
        }
        data.tapX = pointer.x - props.offsetX + 5
        data.tapY = pointer.y - props.offsetY - 10
        data.selectedIndex = i
      }
    }
    const timeString = time => dayjs(time * 1000).format('YYYY-MM-DD HH:mm')
    return {
      t,
      COLORS: config.COLORS,
      list,
      ...toRefs(data),
      tapItem, tapSaveOption,
      timeString
    }
  }
}
</script>

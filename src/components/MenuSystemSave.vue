<template>
  <Container>
    <Container v-for="(v, i) in list" :key="i" :x="rowWidth.half + 10" :y="(i * rowHeight) + rowHeight.half" :width="rowWidth" :height="rowHeight" @pointerdown="p => tapItem(p, i)">
      <Rectangle :visible="i === selectedIndex || (gamepadMode && selectedIndex === null && i === cursorIndex)" :fillColor="COLORS.orange" :width="rowWidth" :height="rowHeight" :alpha="0.8" />
      <Line v-if="i !== list.length - 1" :x="0" :y="rowHeight.half" :lineWidth="0.5" :x2="rowWidth" :strokeColor="COLORS.brown" :alpha="0.25" />
      <Text :x="-rowWidth.half + 10" :y="0" :originY="0.5" :text="v.name" :size="13" :bold="true" />
      <Text v-if="v.exists" :x="-15" :y="0" :originY="0.5" :text="`${t(`place.${v.state.map}`)}\n${timeString(v.state.saved)}`" :lineSpacing="1" :size="11" />
    </Container>
    <Selector v-if="!load && selectedIndex !== null" :x="tapX" :y="tapY" :list="[list[selectedIndex].exists ? t('ui.overwriteSave') : t('ui.normalSave'), t('ui.cancel')]" :selectedIndex="gamepadMode ? optionIndex : null" @select="tapSaveOption" />
  </Container>
</template>

<script>
import { computed, inject, reactive, ref, toRefs } from 'vue'
import { Container, Rectangle, Line } from 'phavuer'
import dayjs from 'dayjs'
import config from '@/data/config'
import Text from '@/components/Text.vue'
import Selector from '@/components/Selector.vue'
export default {
  components: { Container, Rectangle, Text, Line, Selector },
  props: ['offsetX', 'offsetY', 'load', 'controllerActive'],
  emits: ['load'],
  setup (props, context) {
    const storage = inject('storage')
    const gameScene = inject('gameScene')
    const uiScene = inject('uiScene').value
    const audio = inject('audio')
    const controller = inject('controller')
    const list = ref([])
    const data = reactive({
      rowWidth: 220, rowHeight: 37,
      selectedIndex: null,
      cursorIndex: props.load ? 0 : 1,
      optionIndex: 0,
      tapX: 0, tapY: 0
    })
    const loadData = () => {
      storage.getList().then(v => {
        list.value = v
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
    const selectRow = async i => {
      if (props.load) {
        if (!list.value[i]?.state) return
        audio.se('click')
        data.selectedIndex = i
        await storage.load(list.value[i].number)
        await gameScene.value.setField(storage.state.map, storage.state.x, storage.state.y, storage.state.r, { autosave: false })
        context.emit('load')
        return
      }
      if (!i) return
      data.selectedIndex = i
      data.optionIndex = 0
      data.tapX = data.rowWidth.half + 10
      data.tapY = (i * data.rowHeight) + data.rowHeight.half - 5
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
        data.tapX = Math.min(pointer.x - props.offsetX + 5, 190)
        data.tapY = pointer.y - props.offsetY - 10
        data.selectedIndex = i
        data.cursorIndex = i
        data.optionIndex = 0
      }
    }
    const navigate = ({ y }) => {
      if (data.selectedIndex !== null) {
        if (y) data.optionIndex = (data.optionIndex + y + 2) % 2
        return
      }
      if (y < 0 && data.cursorIndex === (props.load ? 0 : 1)) return 'tabs'
      if (y) {
        const first = props.load ? 0 : 1
        data.cursorIndex = Math.fix(data.cursorIndex + y, first, list.value.length - 1)
      }
    }
    const confirm = () => data.selectedIndex !== null ? tapSaveOption(data.optionIndex) : selectRow(data.cursorIndex)
    const cancel = () => {
      if (data.selectedIndex === null) return false
      data.selectedIndex = null
      return true
    }
    const timeString = time => dayjs(time * 1000).format('YYYY-MM-DD HH:mm')
    return {
      t,
      COLORS: config.COLORS,
      list,
      gamepadMode: computed(() => props.controllerActive !== false && controller.value?.gamepadMode),
      ...toRefs(data),
      tapItem, tapSaveOption,
      navigate, confirm, cancel,
      timeString
    }
  }
}
</script>

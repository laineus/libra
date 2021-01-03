<template>
  <Area ref="area" />
</template>

<script>
import { inject, ref, onMounted } from 'vue'
import Area from './Area'
export default {
  components: { Area },
  props: ['to'],
  setup (props) {
    const gameScene = inject('gameScene')
    const area = ref(null)
    const gateEvent = () => gameScene.value.setField(props.to.key, props.to.x, props.to.y, props.to.r)
    const setEvent = (...arg) => area.value.setEvent(...arg)
    const restoreEvent = () => setEvent(gateEvent)
    onMounted(() => {
      setEvent(gateEvent)
    })
    return {
      area,
      setEvent,
      restoreEvent
    }
  }
}
</script>

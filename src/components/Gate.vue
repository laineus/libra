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
    onMounted(() => {
      area.value.setEvent(() => gameScene.value.setField(props.to.key, props.to.x, props.to.y))
    })
    return {
      area
    }
  }
}
</script>

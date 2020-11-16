<template>
  <Indicator ref="indicator" :max="max" :value="modelValue" :width="width" :height="height" :fillColor="COLORS.brown" @pointerdown="pointerdown" @update="update" />
</template>

<script>
import { ref } from 'vue'
import { refObj } from 'phavuer'
import Indicator from '@/components/Indicator'
import config from '@/data/config'
const getScenePosition = object => {
  const getParentPosition = obj => {
    if (!obj.parentContainer) return { x: obj.x, y: obj.y }
    const parentPos = getParentPosition(obj.parentContainer)
    return { x: obj.x + parentPos.x, y: obj.y + parentPos.y }
  }
  return getParentPosition(object)
}
export default {
  components: { Indicator },
  props: {
    modelValue: { require: true, default: 1 },
    max: { default: 1 },
    width: { default: 200 },
    height: { default: 7 }
  },
  emits: ['update:modelValue', 'commit'],
  setup (props, context) {
    const indicator = refObj(null)
    const pointer = ref(null)
    const pointerdown = (p) => {
      pointer.value = p
    }
    const step = props.max / props.width
    const update = () => {
      if (!pointer.value) return
      if (!pointer.value.isDown) {
        pointer.value = null
        context.emit('commit', props.modelValue)
        return
      }
      const offsetX = getScenePosition(indicator.value).x // Doesn't work with Camera
      const x = pointer.value.x - offsetX
      context.emit('update:modelValue', Math.fix(x * step, 0, props.max))
    }
    return {
      COLORS: config.COLORS,
      indicator,
      pointerdown, update
    }
  }
}
</script>

import { ref, unref } from 'vue'

export default (context, object, { y }) => {
  const mode = ref(false)
  const setMode = bool => mode.value = bool
  const shot = r => {
    if (!mode.value) return
    const xDiff = Math.cos(r) * 20
    const yDiff = Math.sin(r) * 20
    context.emit('shot', { x: unref(object).x + xDiff, y: unref(object).y + yDiff + y, r })
  }
  return {
    mode, setMode,
    shot
  }
}

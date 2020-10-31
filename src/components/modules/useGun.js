import { ref, unref } from 'vue'

export default (context, object) => {
  const mode = ref(false)
  const setMode = bool => mode.value = bool
  const shot = r => {
    if (!mode.value) return
    context.emit('shot', { x: unref(object).x, y: unref(object).y, r })
  }
  return {
    mode, setMode,
    shot
  }
}

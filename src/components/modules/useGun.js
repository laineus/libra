import { ref } from 'vue'

export default (context, object) => {
  const mode = ref(false)
  const setMode = bool => mode.value = bool
  const shot = () => {
    if (!mode.value) return
    context.emit('shot', object)
  }
  return {
    mode, setMode,
    shot
  }
}

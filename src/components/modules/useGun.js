import { ref } from 'vue'

export default (context) => {
  const mode = ref(false)
  const setMode = bool => mode.value = bool
  const shot = () => {
    context.emit('shot')
  }
  return {
    mode, setMode,
    shot
  }
}

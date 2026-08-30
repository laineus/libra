import { ref } from 'vue'
const DEFAULT = Symbol('default')
const BASE_FRAME_DURATION = 1000 / 60
export default settings => {
  if (!Array.isArray(settings)) settings = [settings]
  const patterns = {}
  let elapsed = 0
  let lastPlayedKey = null
  const frame = ref(settings[0].frames[0])
  settings.forEach(({ key = DEFAULT, frames, duration }) => {
    patterns[key] = elapsed => {
      const i = Math.floor(elapsed / (duration * BASE_FRAME_DURATION)) % frames.length
      return frames[i]
    }
  })
  const play = (delta, key = DEFAULT) => {
    if (key !== lastPlayedKey) {
      elapsed = 0
      lastPlayedKey = key
    } else {
      elapsed += delta
    }
    frame.value = patterns[key](elapsed)
    return frame.value
  }
  return {
    play,
    frame
  }
}

import { ref } from 'vue'
const DEFAULT = Symbol('default')
export default settings => {
  if (!Array.isArray(settings)) settings = [settings]
  const patterns = {}
  let tick = 0
  let lastPlayedKey = null
  const frame = ref(settings[0].frames[0])
  settings.forEach(({ key = DEFAULT, frames, duration }) => {
    patterns[key] = tick => {
      const i = Math.floor(tick / duration) % frames.length
      return frames[i]
    }
  })
  const play = (key = DEFAULT) => {
    if (key !== lastPlayedKey) {
      tick = 0
      lastPlayedKey = key
    } else {
      tick++
    }
    frame.value = patterns[key](tick)
    return frame.value
  }
  return {
    play,
    frame
  }
}

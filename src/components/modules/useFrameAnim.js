import { unref } from 'vue'
export default (settings, obj) => {
  const patterns = {}
  let tick = 0
  let lastPlayedKey = null
  settings.forEach(({ key, frames, duration }) => {
    patterns[key] = tick => {
      const i = Math.floor(tick / duration) % frames.length
      return frames[i]
    }
  })
  const play = key => {
    if (key !== lastPlayedKey) {
      tick = 0
      lastPlayedKey = key
    } else {
      tick++
    }
    const frame = patterns[key](tick)
    if (obj) unref(obj).setFrame(frame)
    return frame
  }
  return {
    play
  }
}

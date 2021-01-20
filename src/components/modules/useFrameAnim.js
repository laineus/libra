export default settings => {
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
    return patterns[key](tick)
  }
  return {
    play
  }
}

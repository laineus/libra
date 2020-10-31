export default class {
  constructor (sound) {
    this.sound = sound
    this.seVolume = 100
    this.bgmVolume = 100
    this.currentBgm = null
  }
  // SE
  setSeVolume (value) {
    this.seVolume = Math.fix(value, 0, 100)
    return this
  }
  se (name) {
    this.sound.play(`se/${name}`, { volume: this.seVolume })
  }
  // BGM
  setBgmVolume (value) {
    this.bgmVolume = Math.fix(value, 0, 100)
    // Update volume for existing BGM
    this.sound.sounds.filter(sound => sound.key.startsWith('bgm')).forEach(bgm => {
      bgm.volume = this.bgmVolume
    })
    return this
  }
  setBgm (name) {
    if (!name) {
      this.currentBgm = null
      this.sound.stopAll()
      return
    }
    const key = `bgm/${name}`
    if (this.currentBgm?.key === key) return
    this.currentBgm?.stop()
    this.currentBgm = this.sound.add(key, { loop: true, volume: this.bgmVolume })
    this.currentBgm.play()
  }
  interruptBgm (name) {
    const key = `bgm/${name}`
    if (this.currentBgm?.key === key) return () => null
    this.currentBgm?.pause()
    const bgm = this.sound.add(key, { loop: true, volume: this.bgmVolume, duration: 200 })
    bgm.play()
    const resolve = () => {
      this.currentBgm?.resume()
      if (bgm.isPlaying) bgm.stop()
    }
    return resolve
  }
}

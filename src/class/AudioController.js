export default class {
  constructor (sound, bgmVolume, seVolume) {
    this.sound = sound
    this.setBgmVolume(bgmVolume)
    this.setSeVolume(seVolume)
    this.currentBgm = null
  }
  // SE
  setSeVolume (value) {
    this.seVolume = Math.fix(value / 100, 0, 1)
    return this
  }
  se (name) {
    this.sound.play(`se/${name}`, { volume: this.seVolume })
  }
  // BGM
  setBgmVolume (value) {
    this.bgmVolume = Math.fix(value / 100, 0, 1)
    // Update volume for existing BGM
    this.sound.sounds.filter(sound => sound.key.startsWith('bgm')).forEach(bgm => {
      bgm.volume = this.bgmVolume
    })
    return this
  }
  setBgm (name, config) {
    if (!name) {
      this.currentBgm = null
      this.sound.stopAll()
      return
    }
    const key = `bgm/${name}`
    if (this.currentBgm?.key === key) return
    this.currentBgm?.stop()
    this.currentBgm = this.sound.add(key, Object.assign({ loop: true, volume: this.bgmVolume }, config))
    this.currentBgm.play()
  }
  interruptBgm (name, config) {
    const key = `bgm/${name}`
    if (this.currentBgm?.key === key) return () => null
    this.currentBgm?.pause()
    const bgm = this.sound.add(key, Object.assign({ loop: true, volume: this.bgmVolume, duration: 200 }, config))
    bgm.play()
    const resolve = () => {
      this.currentBgm?.resume()
      if (bgm.isPlaying) bgm.stop()
    }
    return resolve
  }
}

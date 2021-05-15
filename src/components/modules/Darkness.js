const argbToRgba = argb => {
  const argbStr = argb.toColorString
  return `#${argbStr.substr(3, 6)}${argbStr.substr(1, 2)}`
}
export default class {
  constructor (scene, key, width, height, compression = 1) {
    width = Math.ceil(width / compression)
    height = Math.ceil(height / compression)
    this.compression = compression
    this.texture = scene.textures.createCanvas(key, width, height)
    this.context = this.texture.getContext()
    this.width = width
    this.height = height
    this.lights = null
    this.savedImageData = null
  }
  save () {
    this.savedImageData = this.context.getImageData(0, 0, this.width, this.height)
    return this
  }
  restore () {
    if (!this.savedImageData) return this
    this.context.putImageData(this.savedImageData, 0, 0)
    return this
  }
  refresh () {
    this.texture.refresh()
    return this
  }
  clear () {
    this.context.clearRect(0, 0, this.width, this.height)
    return this
  }
  destroy () {
    this.texture.destroy()
  }
  fillBg (color) {
    this.context.globalCompositeOperation = 'source-over'
    this.context.fillStyle = argbToRgba(color)
    this.context.fillRect(0, 0, this.width, this.height)
    return this
  }
  removeArc (x, y, radius) {
    x /= this.compression
    y /= this.compression
    radius /= this.compression
    this.context.beginPath()
    const gradient = this.context.createRadialGradient(x, y, 0, x, y, radius)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    this.context.globalCompositeOperation = 'destination-out'
    this.context.fillStyle = gradient
    this.context.arc(x, y, radius, 0, Math.PI * 2)
    this.context.fill()
    return this
  }
  removeArcs (list) {
    list.forEach(v => this.removeArc(v.x, v.y, v.radius))
    return this
  }
}

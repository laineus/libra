export default class {
  constructor (scene, key, width, height) {
    this.texture = scene.textures.createCanvas(key, width, height)
    this.context = this.texture.getContext()
    this.width = width
    this.height = height
    this.lights = null
    this.render()
  }
  setLights (array) {
    this.lights = array
    this.render()
  }
  render () {
    this.context.globalCompositeOperation = 'source-over'
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, this.width, this.height)
    if (this.lights) {
      this.context.globalCompositeOperation = 'destination-out'
      this.lights.forEach(obj => {
        this.context.beginPath()
        const gradient = this.context.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, 100)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        this.context.fillStyle = gradient
        this.context.arc(obj.x, obj.y, 100, 0, Math.PI * 2)
        this.context.fill()
      })
    }
    this.texture.refresh()
  }
}

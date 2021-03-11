import { inject } from 'vue'
export default {
  bgm: 'wind',
  async create () {
    const field = inject('field').value
    const state = inject('storage').state

    const area = field.getObjectById(7).object
    state.stomach.map(name => {
      const x = Math.randomInt(area.x, area.x + area.width)
      const y = Math.randomInt(area.y, area.y + area.height)
      return { name, x, y }
    }).forEach(field.addObject)
    state.stomach.splice(0)
  }
}

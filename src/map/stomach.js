import { inject } from 'vue'
export default {
  bgm: 'wind',
  async create () {
    const field = inject('field').value
    const state = inject('storage').state
    const uiScene = inject('uiScene').value

    if ((state.status.heart + state.status.body) < 1) {
      field.getObjectById(4).setEvent(async () => uiScene.log.push(t('events.block.status', 1)))
      field.getObjectById(5).setEvent(async () => uiScene.log.push(t('events.block.status', 1)))
    }
    if ((state.status.heart + state.status.body) < 3) {
      field.getObjectById(6).setEvent(async () => uiScene.log.push(t('events.block.status', 3)))
    }

    if (state.tutorial.includes('home')) sleep(1000).then(() => uiScene.setTutorial('map'))

    const area = field.getObjectById(7).object
    state.stomach.map(name => {
      const x = Math.randomInt(area.x, area.x + area.width)
      const y = Math.randomInt(area.y, area.y + area.height)
      return { name, x, y }
    }).forEach(field.addObject)
    state.stomach.splice(0)
  }
}

import { inject } from 'vue'
export default {
  bgm: null,
  async create () {
    const field = inject('field').value
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    if ((state.status.heart + state.status.body) < 10) {
      field.getObjectById(2).setEvent(async () => uiScene.log.push(t('events.block.status', 10)))
    }
  }
}

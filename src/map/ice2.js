import { inject } from 'vue'
const STEPS = {
  NULL: 0,
  COMPLETED: 1
}
import Talker from '@/util/Talker'
export default {
  name: '氷2',
  async create () {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value

    const penguin = field.getObjectById(4)
    const speakPenguin = talk.getSpeakScripts(new Talker('ペンギン', penguin.object))

    penguin.setTapEvent(async () => {
      if (state.events.liveForEveryone === STEPS.NULL) {
        await speakPenguin(t('events.liveForEveryone.start'))
        await field.dropItem('apple')
        const thankYou = await uiScene.setSelector(t('events.liveForEveryone.options')) === 0
        await speakPenguin(thankYou ? t('events.liveForEveryone.answer1') : t('events.liveForEveryone.answer2'))
        state.events.liveForEveryone = STEPS.COMPLETED
      } else if (state.events.liveForEveryone === STEPS.COMPLETED) {
        return await speakPenguin(t('events.liveForEveryone.completed'))
      }
    })
  }
}

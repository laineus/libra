import { inject } from 'vue'
import Talker from '@/util/Talker'
import { LIVE_FOR_EVERYONE_STEPS } from '@/data/eventSteps'
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
      if (state.events.liveForEveryone === LIVE_FOR_EVERYONE_STEPS.NULL) {
        await speakPenguin(t('events.liveForEveryone.start'))
        await field.dropItem('apple', penguin.object)
        const thankYou = await uiScene.setSelector(t('events.liveForEveryone.options')) === 0
        await speakPenguin(thankYou ? t('events.liveForEveryone.answer1') : t('events.liveForEveryone.answer2'))
        state.events.liveForEveryone = LIVE_FOR_EVERYONE_STEPS.COMPLETED
      } else if (state.events.liveForEveryone === LIVE_FOR_EVERYONE_STEPS.COMPLETED) {
        return await speakPenguin(t('events.liveForEveryone.completed'))
      }
    })
  }
}

import { inject } from 'vue'
import Talker from '@/util/Talker'
import { STRAWDOLL_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'deeper',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const flog = field.getObjectById(5)
    flog?.setTapEvent(async () => {
      const speakFlog = talk.getSpeakScripts(new Talker(t('name.flog'), flog.object))
      if (state.events.strawDoll === STRAWDOLL_STEPS.NULL) {
        await speakFlog(t('events.strawDoll.start'))
        const receive = await uiScene.setSelector(t('events.strawDoll.options')) === 1
        if (!receive) {
          return await speakFlog(t('events.strawDoll.answer1'))
        }
        await speakFlog(t('events.strawDoll.answer2_1'))
        await field.dropItem('strawDoll', flog.object)
        await speakFlog(t('events.strawDoll.answer2_2'))
        state.events.strawDoll = STRAWDOLL_STEPS.RECEIVED
      } else if (bag.hasItem('strawDoll', 1, { bag: true, room: true, field: true })) {
        await speakFlog(t('events.strawDoll.received'))
      } else {
        await speakFlog(t('events.strawDoll.disposed'))
        await field.dropItem('strawDoll', flog.object)
      }
    })
  }
}

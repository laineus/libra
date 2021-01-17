import { inject } from 'vue'
import Talker from '@/util/Talker'
const STEPS = {
  NULL: 0,
  RECEIVED: 1
}
export default {
  name: '洞窟2',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const flog = field.getObjectById(5)
    const speakFlog = talk.getSpeakScripts(new Talker('カエル', flog.object))

    const dropDoll = () => field.addObject({ type: 'Substance', name: 'strawDoll', x: flog.object.x, y: flog.object.y }).then(v => v.drop())
    flog.setTapEvent(async () => {
      if (state.events.strawDoll === STEPS.NULL) {
        await speakFlog(t('events.strawDoll.start'))
        const receive = await uiScene.setSelector(t('events.strawDoll.options')) === 1
        if (!receive) {
          return await speakFlog(t('events.strawDoll.answer1'))
        }
        const scripts = t('events.strawDoll.answer2')
        await speakFlog(scripts.splice(0, 2))
        await dropDoll()
        await speakFlog(scripts)
        state.events.strawDoll = STEPS.RECEIVED
      } else if (bag.hasItem('strawDoll', 1, { bag: true, room: true, field: true })) {
        await speakFlog(t('events.strawDoll.received'))
      } else {
        await speakFlog(t('events.strawDoll.disposed'))
        await dropDoll()
      }
    })
  }
}

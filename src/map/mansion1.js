import { inject } from 'vue'
import Talker from '@/util/Talker'
import { APPRECIATION_STEPS } from '@/data/eventSteps'
export default {
  name: '豪邸1',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const child = field.getObjectById(3)
    child?.setTapEvent(async () => {
      const speakChild = talk.getSpeakScripts(new Talker('カボチャ', child.object))
      if (state.events.appreciation < APPRECIATION_STEPS.STARTED) {
        await speakChild(state.events.appreciation === APPRECIATION_STEPS.NULL ? t('events.child.start') : t('events.child.start').slice(-1))
        const accept = await uiScene.setSelector(t('events.child.options')) === 0
        if (accept) {
          await speakChild(t('events.child.answer1'))
          await field.dropItem('art16', child.object)
          uiScene.log.push(t('ui.questStart', t('quest.appreciation')))
          state.events.appreciation = APPRECIATION_STEPS.STARTED
        } else {
          await speakChild(t('events.child.answer2'))
          state.events.appreciation = APPRECIATION_STEPS.TALKED
        }
      } else if (state.events.appreciation === APPRECIATION_STEPS.STARTED) {
        if (bag.hasItem('art16', 1, { bag: true, room: true, field: true })) {
          await speakChild(t('events.child.started'))
        } else {
          await speakChild(t('events.child.lost'))
          await field.dropItem('art16', child.object)
        }
      } else if (state.events.appreciation === APPRECIATION_STEPS.SOLVED) {
        await speakChild(t('events.child.complete1'))
        field.dropItem('coinSilver', child.object)
        field.dropItem('sapphire', child.object)
        await field.dropItem('apple', child.object)
        await speakChild(t('events.child.complete2'))
        uiScene.log.push(t('ui.questComplete', t('quest.appreciation')))
        state.events.appreciation = APPRECIATION_STEPS.COMPLETED
      } else if (state.events.appreciation === APPRECIATION_STEPS.COMPLETED) {
        await speakChild(t('events.child.completed'))
      }
    })
  }
}

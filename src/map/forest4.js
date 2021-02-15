import { inject } from 'vue'
import Talker from '@/util/Talker'
import { CLOVER_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'toaru',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const flog = field.getObjectById(3)
    flog?.setTapEvent(async () => {
      const speakFlog = talk.getSpeakScripts(new Talker(t('name.flog'), flog.object))
      if (state.events.clover === CLOVER_STEPS.NULL) {
        await speakFlog(t('events.clover.flog1'))
        uiScene.log.push(t('ui.questStart', t('quest.clover')))
        state.events.clover = CLOVER_STEPS.STARTED
      } else if (state.events.clover === CLOVER_STEPS.STARTED) {
        if (!bag.hasItem('clover4')) return await speakFlog(t('events.clover.flog1'))
        const give = await uiScene.setSelector(t('events.clover.flog2.options')) === 0
        if (give) {
          bag.removeItem('clover4')
          uiScene.log.push(t('events.clover.flog2.log'))
          await speakFlog(t('events.clover.flog2.end1'))
        } else {
          await speakFlog(t('events.clover.flog2.end2'))
        }
        await field.dropItem('apple', flog.object)
        uiScene.log.push(t('ui.questComplete', t('quest.clover')))
        state.events.clover = CLOVER_STEPS.COMPLETED
      } else if (state.events.clover === CLOVER_STEPS.COMPLETED) {
        await speakFlog(t('events.clover.flog3'))
      }
    })
  }
}

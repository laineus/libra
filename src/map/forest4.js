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
        await speakFlog(t('events.clover.greet'))
        const sorry = await uiScene.setSelector(t('events.clover.options1')) === 1
        if (sorry) return
        uiScene.log.push(t('ui.questStart', t('quest.clover')))
        state.events.clover = CLOVER_STEPS.STARTED
        await speakFlog(t('events.clover.start1'))
        await speakFlog(t('events.clover.start2'))
      } else if (state.events.clover === CLOVER_STEPS.STARTED) {
        if (!bag.hasItem('clover4')) return await speakFlog(t('events.clover.start2'))
        const give = await uiScene.setSelector(t('events.clover.options2')) === 0
        if (!give) return
        bag.removeItem('clover4')
        uiScene.log.push(t('events.clover.log'))
        await speakFlog(t('events.clover.complete'))
        field.dropItem('apple', flog.object)
        uiScene.log.push(t('ui.questComplete', t('quest.clover')))
        state.events.clover = CLOVER_STEPS.COMPLETED
      } else if (state.events.clover === CLOVER_STEPS.COMPLETED) {
        await speakFlog(t('events.clover.completed'))
      }
    })
  }
}

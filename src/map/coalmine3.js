import { inject } from 'vue'
import Talker from '@/util/Talker'
import { MATSUTAKE_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'akai',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const penguin = field.getObjectById(2)
    penguin?.setTapEvent(async () => {
      const speakPenguin = talk.getSpeakScripts(new Talker(t('name.minePenguin'), penguin.object))
      if (state.events.matsutake === MATSUTAKE_STEPS.NULL) {
        await speakPenguin(t('events.matsutake.start'))
        uiScene.log.push(t('ui.questStart', t('quest.matsutake')))
        state.events.matsutake = MATSUTAKE_STEPS.STARTED
      } else if (state.events.matsutake === MATSUTAKE_STEPS.STARTED) {
        if (!bag.hasItem('matsutake')) return await speakPenguin(t('events.matsutake.started'))
        const cancel = await uiScene.setSelector(t('events.matsutake.options')) === 1
        if (cancel) return
        bag.removeItem('matsutake')
        uiScene.log.push(t('events.matsutake.log'))
        await speakPenguin(t('events.matsutake.complete'))
        await field.dropItem('apple', penguin.object)
        uiScene.log.push(t('ui.questComplete', t('quest.matsutake')))
        state.events.matsutake = MATSUTAKE_STEPS.COMPLETED
      } else if (state.events.matsutake === MATSUTAKE_STEPS.COMPLETED) {
        await speakPenguin(t('events.matsutake.completed'))
      }
    })
  }
}

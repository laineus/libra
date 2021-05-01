import { inject } from 'vue'
import Talker from '@/util/Talker'
import { MATSUTAKE_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'mary',
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
        const options = t('events.matsutake.options').filter((_, i) => {
          if (i === 0) return bag.hasItem('matsutake')
          if (i === 1) return bag.hasItem('kinoko')
          return true
        })
        if (options.length === 1) return await speakPenguin(t('events.matsutake.started')) // Don't have both
        const selectedIndex = await uiScene.setSelector(options)
        if (selectedIndex === (options.length - 1)) return // Cancelled
        if (selectedIndex === 0 && bag.hasItem('matsutake')) {
          bag.removeItem('matsutake')
          uiScene.log.push(t('events.matsutake.log1'))
          await speakPenguin(t('events.matsutake.complete1'))
        } else {
          bag.removeItem('kinoko')
          uiScene.log.push(t('events.matsutake.log2'))
          await speakPenguin(t('events.matsutake.complete2'))
        }
        await field.dropItem('apple', penguin.object)
        uiScene.log.push(t('ui.questComplete', t('quest.matsutake')))
        state.events.matsutake = MATSUTAKE_STEPS.COMPLETED
      } else if (state.events.matsutake === MATSUTAKE_STEPS.COMPLETED) {
        await speakPenguin(t('events.matsutake.completed'))
      }
    })

    const mistely = field.getObjectById(23)
    mistely?.setTapEvent(async () => {
      const speakPenguin = talk.getSpeakScripts(new Talker(t('name.minePenguin'), mistely.object))
      await speakPenguin(state.events.cosmos ? t('events.cosmos.minePenguin2') : t('events.cosmos.minePenguin1'))
    })
  }
}

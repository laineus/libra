import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
import config from '@/data/config'
import { FOREVER_STEPS } from '@/data/eventSteps'
export default {
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state

    const ghost = field.getObjectById(3)
    ghost?.setVisible(computed(() => state.events.forever < FOREVER_STEPS.COMPLETED))
    ghost?.setTapEvent(async () => {
      const speakGhost = talk.getSpeakScripts(new Talker(t('name.ghost'), ghost.object))
      if (state.events.forever === FOREVER_STEPS.NULL) {
        await speakGhost(t('events.forever.ghost.start'))
        const accept = await uiScene.setSelector(t('events.forever.ghost.options')) === 0
        if (accept) {
          await speakGhost(t('events.forever.ghost.answer1'))
          uiScene.log.push(t('ui.questStart', t('quest.forever')))
          state.events.forever = FOREVER_STEPS.STARTED
        } else {
          await speakGhost(t('events.forever.ghost.answer2'))
        }
      } else if (state.events.forever === FOREVER_STEPS.STARTED) {
        await speakGhost(t('events.forever.ghost.started'))
      } else if (state.events.forever === FOREVER_STEPS.EXECUTED) {
        await speakGhost(t('events.forever.ghost.complete1'))
        await field.dropItem('apple', ghost.object)
        await speakGhost(t('events.forever.ghost.complete2'))
        const completeTransition = await uiScene.transition(1000, { color: config.COLORS.white })
        uiScene.log.push(t('ui.questComplete', t('quest.forever')))
        state.events.forever = FOREVER_STEPS.COMPLETED
        await completeTransition()
      }
    })
  }
}

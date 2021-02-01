import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
import config from '@/data/config'
import { ENLIGHTENMENT_STEPS } from '@/data/eventSteps'
export default {
  name: '病院1',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state

    const ghost = field.getObjectById(3)
    const speakGhost = talk.getSpeakScripts(new Talker('幽霊', ghost.object))

    ghost.setVisible(computed(() => state.events.enlightenment === ENLIGHTENMENT_STEPS.NULL))
    ghost.setTapEvent(async () => {
      await speakGhost(t('events.enlightenment.start1'))
      const answer1 = await uiScene.setSelector(t('events.enlightenment.options')) === 0
      await speakGhost(answer1 ? t('events.enlightenment.answer1') : t('events.enlightenment.answer2'))
      await speakGhost(t('events.enlightenment.complete'))
      const completeTransition = await uiScene.transition(1000, { color: config.COLORS.white })
      field.dropItem('apple', ghost.object)
      state.events.enlightenment = ENLIGHTENMENT_STEPS.COMPLETED
      await completeTransition()
    })
  }
}

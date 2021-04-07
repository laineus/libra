import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
import config from '@/data/config'
import { ENLIGHTENMENT_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'libra',
  async create () {
    const gameScene = inject('gameScene').value
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state

    const ghost = field.getObjectById(3)
    ghost?.setVisible(computed(() => state.events.enlightenment === ENLIGHTENMENT_STEPS.NULL))
    ghost?.setTapEvent(async () => {
      const speakGhost = talk.getSpeakScripts(new Talker(t('name.ghost'), ghost.object))
      await speakGhost(t('events.enlightenment.start1'))
      const answer1 = await uiScene.setSelector(t('events.enlightenment.options')) === 0
      await speakGhost(answer1 ? t('events.enlightenment.answer1') : t('events.enlightenment.answer2'))
      await speakGhost(t('events.enlightenment.complete'))
      const completeTransition = await uiScene.transition(1000, { color: config.COLORS.white })
      field.dropItem('apple', ghost.object)
      uiScene.log.push(t('ui.questComplete', t('quest.enlightenment')))
      state.events.enlightenment = ENLIGHTENMENT_STEPS.COMPLETED
      await completeTransition()
    })

    const button = field.getObjectById(29)
    button.setTapEvent(async () => {
      gameScene.setField('hospital1night', state.x, state.y, state.r, { transition: 0 })
    })
  }
}

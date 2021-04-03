import { inject } from 'vue'
import Talker from '@/util/Talker'
import { PAINTER_STEPS } from '@/data/eventSteps'
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
      if (state.events.painter < PAINTER_STEPS.STARTED) {
        if (state.events.painter === PAINTER_STEPS.NULL) {
          await speakPenguin(t('events.painter.start'))
          state.events.painter = PAINTER_STEPS.TALKED
        } else if (state.events.painter === PAINTER_STEPS.TALKED) {
          await speakPenguin(t('events.painter.talked'))
        }
        const accept = await uiScene.setSelector(t('events.painter.options')) === 0
        if (accept) {
          await speakPenguin(t('events.painter.answer1'))
          await field.dropItem('art15', penguin.object)
          uiScene.log.push(t('ui.questStart', t('quest.painter')))
          state.events.painter = PAINTER_STEPS.STARTED
        } else {
          await speakPenguin(t('events.painter.answer2'))
        }
      } else if (state.events.painter === PAINTER_STEPS.STARTED) {
        if (bag.hasItem('art15', 1, { bag: true, room: true, field: true })) {
          await speakPenguin(t('events.painter.started'))
        } else {
          await speakPenguin(t('events.painter.lost'))
          await field.dropItem('art15', penguin.object)
        }
      } else if (state.events.painter === PAINTER_STEPS.SOLVED) {
        await speakPenguin(t('events.painter.complete'))
        uiScene.log.push(t('ui.questComplete', t('quest.painter')))
        state.events.painter = PAINTER_STEPS.COMPLETED
      } else if (state.events.painter === PAINTER_STEPS.COMPLETED) {
        await speakPenguin(t('events.painter.completed'))
      }
    })
  }
}

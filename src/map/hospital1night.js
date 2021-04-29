import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
import { FOREVER_STEPS } from '@/data/eventSteps'
import { lockInHospital, initHospitalButton, hideChara } from '@/map/hospitalFunctions'
export default {
  bgm: null,
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state

    initHospitalButton(field.getObjectById(54))
    lockInHospital()
    hideChara()

    const ghost = field.getObjectById(3)
    ghost?.setVisible(computed(() => {
      if (state.events.forever === FOREVER_STEPS.NULL && state.killed.includes('hospital1_23')) return false // Killed before started
      return true
    }))
    ghost?.setTapEvent(async () => {
      const speakGhost = talk.getSpeakScripts(new Talker(t('name.ghost'), ghost.object))
      if (state.events.forever === FOREVER_STEPS.NULL) {
        await speakGhost(t('events.forever.ghost.start'))
        const accept = await uiScene.setSelector(t('events.forever.ghost.options')) === 0
        if (accept) {
          await speakGhost(t('events.forever.ghost.answer1'))
          await speakGhost(t('events.forever.ghost.started'))
          uiScene.log.push(t('ui.questStart', t('quest.forever')))
          state.events.forever = FOREVER_STEPS.STARTED
        } else {
          await speakGhost(t('events.forever.ghost.answer2'))
        }
      } else if (state.events.forever === FOREVER_STEPS.STARTED) {
        await speakGhost(t('events.forever.ghost.started'))
      } else if (state.events.forever === FOREVER_STEPS.EXECUTED) {
        await speakGhost(t('events.forever.ghost.complete'))
        await field.dropItem('apple', ghost.object)
        uiScene.log.push(t('ui.questComplete', t('quest.forever')))
        state.events.forever = FOREVER_STEPS.COMPLETED
      } else if (state.events.forever === FOREVER_STEPS.COMPLETED) {
        await speakGhost(t('events.forever.ghost.completed'))
      }
    })
    const doctor = field.getObjectById(55)
    doctor?.setVisible(computed(() => state.events.forever >= FOREVER_STEPS.EXECUTED))
    doctor?.setTapEvent(async () => {
      const speak = talk.getSpeakScripts(new Talker(t('name.doctorPenguin'), doctor.object))
      await speak(t('events.forever.doctor.completed'))
    })
  }
}

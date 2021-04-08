import { inject } from 'vue'
import Talker from '@/util/Talker'
import { BOGUS_STEPS } from '@/data/eventSteps'
import initHospitalButton from './initHospitalButton'
export default {
  bgm: null,
  async create () {
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    initHospitalButton(field.getObjectById(89))

    const list = [
      { chara: field.getObjectById(90), script: t('events.bogusDoctor.patient1'), talked: false },
      { chara: field.getObjectById(91), script: t('events.bogusDoctor.patient2'), talked: false },
      { chara: field.getObjectById(92), script: t('events.bogusDoctor.patient3'), talked: false },
      { chara: field.getObjectById(93), script: t('events.bogusDoctor.patient4'), talked: false }
    ]
    const ghost5 = field.getObjectById(3)
    ghost5.setVisible(false)
    if (state.events.bogusDoctor !== BOGUS_STEPS.STARTED) {
      list.forEach(v => v.chara.setVisible(false))
    } else {
      list.forEach(v => {
        v.chara?.setTapEvent(async () => {
          const speak = talk.getSpeakScripts(new Talker(t('name.doctorPenguin'), v.chara.object))
          await speak(v.script)
          v.talked = true
          if (list.every(v => v.talked)) ghost5.setVisible(true)
        })
      })
      ghost5?.setTapEvent(async () => {
        const speak = talk.getSpeakScripts(new Talker(t('name.doctorPenguin'), ghost5.object))
        await speak(t('events.bogusDoctor.patient5'))
        state.events.bogusDoctor = BOGUS_STEPS.SOLVED
      })
    }

    const amili = field.getObjectById(94)
    amili.setVisible(state.events.bogusDoctor === BOGUS_STEPS.STARTED)
    amili.setRandomWalk(false)
    amili.setTapEvent(async () => {
      amili.substance.hp = 0
    })
  }
}

import { computed, inject } from 'vue'
import { initHospitalButton } from '@/map/hospitalFunctions'
import { FOREVER_STEPS } from '@/data/eventSteps'
import Talker from '@/util/Talker'
export default {
  bgm: 'libra',
  async create () {
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state

    initHospitalButton(field.getObjectById(29))

    const doctor = field.getObjectById(23)
    if (doctor) {
      const speakTorrent = talk.getSpeakScripts(new Talker(t('name.doctorPenguin'), doctor.object))

      let skipStart1 = false
      doctor.setVisible(computed(() => state.events.forever < FOREVER_STEPS.EXECUTED))
      doctor.setTapEvent(async () => {
        if (state.events.forever === FOREVER_STEPS.STARTED) {
          if (!skipStart1) {
            await speakTorrent(t('events.forever.doctor.greet'))
            await speakTorrent(t('events.forever.doctor.start1'))
            skipStart1 = true
          }
          await speakTorrent(t('events.forever.doctor.start2'))
        } else {
          await speakTorrent(t('events.forever.doctor.greet'))
        }
      })
      doctor.setDestroyEvent(() => {
        if (state.events.forever === FOREVER_STEPS.STARTED) {
          state.events.forever = FOREVER_STEPS.EXECUTED
        }
      })
    }
  }
}

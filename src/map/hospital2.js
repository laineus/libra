import { computed, inject, watch } from 'vue'
import Talker from '@/util/Talker'
import { BOGUS_STEPS } from '@/data/eventSteps'
import { initHospitalButton } from '@/map/hospitalFunctions'
export default {
  bgm: 'libra',
  async create () {
    const gameScene = inject('gameScene').value
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const event = inject('event')

    const libra = inject('player')

    initHospitalButton(field.getObjectById(63))

    const doctor = field.getObjectById(3)
    const speakDoctor = talk.getSpeakScripts(new Talker(t('name.doctorPenguin'), doctor?.object))
    doctor?.setTapEvent(computed(() => {
      if (state.events.bogusDoctor === BOGUS_STEPS.NULL) {
        return async () => {
          await speakDoctor(t('events.bogusDoctor.talk1'))
          const cancel = await uiScene.setSelector(t('events.bogusDoctor.options1')) === 1
          if (cancel) return await speakDoctor(t('events.bogusDoctor.cancel'))
          uiScene.log.push(t('ui.questStart', t('quest.bogusDoctor')))
          await speakDoctor(t('events.bogusDoctor.talk2'))
          await speakDoctor(t('events.bogusDoctor.talk3'))
          await uiScene.setSelector(t('events.bogusDoctor.options2'))
          state.events.bogusDoctor = BOGUS_STEPS.STARTED
          await gameScene.setField('hospital2night', (5).toPixelCenter, (24).toPixelCenter, 'up', { transition: 0 })
          // hospital2night
          await sleep(300)
          const speakLibra = talk.getSpeakScripts(new Talker(t('name.libra'), libra.value.object))
          const speakPatient = talk.getSpeakScripts(new Talker(t('name.patient'), { x: 815, y: 640 }))
          await speakLibra(t('events.libra.exclamation'))
          await sleep(1000)
          await speakPatient(t('events.bogusDoctor.patient0'))
        }
      } else if (state.events.bogusDoctor === BOGUS_STEPS.COMPLETED) {
        return async () => {
          await speakDoctor(t('events.bogusDoctor.completed'))
        }
      }
    }))
    if (state.events.bogusDoctor === BOGUS_STEPS.SOLVED) {
      event.exec(async () => {
        if (!doctor) return
        const unwatch = watch(() => event.state, value => {
          if (!value) event.setState(true)
        })
        const speakLibra = talk.getSpeakScripts(new Talker(t('name.libra'), libra.value.object))
        libra.value.object.setPosition(doctor.object.x, doctor.object.y + 70)
        libra.value.lookTo('up')
        doctor.startEvent()
        await sleep(1000)
        await speakLibra(t('events.libra.exclamation'))
        await sleep(1000)
        await speakDoctor(t('events.bogusDoctor.talk3'))
        const answer1 = await uiScene.setSelector(t('events.bogusDoctor.options2')) === 0
        await speakDoctor(answer1 ? t('events.bogusDoctor.answer1') : t('events.bogusDoctor.answer2'))
        await speakDoctor(t('events.bogusDoctor.complete'))
        await field.dropItem('apple', doctor.object)
        uiScene.log.push(t('ui.questComplete', t('quest.bogusDoctor')))
        state.events.bogusDoctor = BOGUS_STEPS.COMPLETED
        unwatch()
      })
    }
  }
}

import { inject } from 'vue'
import Talker from '@/util/Talker'
import { EEL_STEPS } from '@/data/eventSteps'
export default {
  name: '氷1',
  async create () {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const bag = inject('bag')

    const fisher = field.getObjectById(3)
    const speakFisher = talk.getSpeakScripts(new Talker('ペンギン', fisher.object))

    fisher.setTapEvent(async () => {
      const option2 = async () => {
        const ignore = await uiScene.setSelector(t('events.eel.startOptions2')) === 1
        if (ignore) {
          state.events.eel = EEL_STEPS.IGNORED
          return await speakFisher(t('events.eel.answer2'))
        }
        state.events.eel = EEL_STEPS.STARTED
        await speakFisher(t('events.eel.answer1'))
        await field.dropItem('uminoke', fisher.object)
      }
      if (state.events.eel === EEL_STEPS.NULL) {
        await speakFisher(t('events.eel.start1'))
        const ignore = await uiScene.setSelector(t('events.eel.startOptions1')) === 1
        if (ignore) return await speakFisher(t('events.eel.answer2'))
        await speakFisher(t('events.eel.start2'))
        await option2()
      } else if (state.events.eel === EEL_STEPS.IGNORED) {
        await speakFisher(t('events.eel.start3'))
        await option2()
      } else if (state.events.eel === EEL_STEPS.STARTED) {
        if (bag.hasItem('uminoke', 1, { bag: true, room: true, field: true })) {
          await speakFisher(t('events.eel.answer1'))
        } else {
          await speakFisher(t('events.eel.lost'))
          await field.dropItem('uminoke', fisher.object)
        }
      } else if (state.events.eel === EEL_STEPS.SOLVED) {
        if (!bag.hasItem('antonLetter')) {
          await speakFisher(t('events.eel.end1'))
          await field.dropItem('apple', fisher.object)
          state.events.eel = EEL_STEPS.COMPLETED1
          return
        }
        const options = bag.hasItem('unadon') ? t('events.eel.endOptions') : t('events.eel.endOptions').slice(1)
        const giveUnadon = await uiScene.setSelector(options) === 0
        bag.removeItem('antonLetter')
        uiScene.log.push(t('events.eel.log1'))
        if (giveUnadon) {
          bag.removeItem('unadon')
          uiScene.log.push(t('events.eel.log2'))
        }
        await speakFisher(t('events.eel.end2'))
        await field.dropItem('apple', fisher.object)
        state.events.eel = EEL_STEPS.COMPLETED2
      } else if (state.events.eel === EEL_STEPS.COMPLETED1) {
        await speakFisher(t('events.eel.completed1'))
      } else if (state.events.eel === EEL_STEPS.COMPLETED2) {
        await speakFisher(t('events.eel.completed2'))
      }
    })
  }
}

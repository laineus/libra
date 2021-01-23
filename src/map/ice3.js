import { inject } from 'vue'
import { STEPS as EEL_STEPS } from '@/map/ice1'
import Talker from '@/util/Talker'
export default {
  name: '氷3',
  async create () {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const bag = inject('bag')

    const anton = field.getObjectById(3)
    const speakAnton = talk.getSpeakScripts(new Talker('アントン先生', anton.object))

    anton.setTapEvent(async () => {
      if (state.events.eel < EEL_STEPS.STATED) {
        return await speakAnton(t('events.anton.start1'))
      } else if (state.events.eel === EEL_STEPS.STATED) {
        await speakAnton(t('events.anton.start1'))
        if (!bag.hasItem('uminoke')) return
        const cancel = await uiScene.setSelector(t('events.anton.startOptions1')) === 1
        if (cancel) return
        bag.removeItem('uminoke')
        uiScene.log.push(t('events.anton.giveLog'))
        await speakAnton(t('events.anton.start2'))
        await uiScene.setSelector(t('events.anton.startOptions2'))
        await speakAnton(t('events.anton.start3'))
        const approgize = await uiScene.setSelector(t('events.anton.startOptions3')) === 1
        if (approgize) {
          const scripts = t('events.anton.answer2')
          await speakAnton(scripts.splice(0, 2))
          await uiScene.transition(1000)()
          await speakAnton(scripts)
          field.dropItem('unadon')
          await field.dropItem('antonLetter')
        } else {
          const scripts = t('events.anton.answer1')
          await speakAnton(scripts.splice(0, 1))
          await uiScene.transition(1000)()
          await speakAnton(scripts)
          await field.dropItem('unadon')
        }
        state.events.eel = EEL_STEPS.SOLVED
      } else if (state.events.eel >= EEL_STEPS.SOLVED) {
        await speakAnton(t('events.anton.completed'))
      }
    })
  }
}

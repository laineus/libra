import { inject } from 'vue'
import Talker from '@/util/Talker'
import { CLOVER_STEPS } from '@/data/eventSteps'
export default {
  name: '森4',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const flog = field.getObjectById(3)
    const speakFlog = talk.getSpeakScripts(new Talker('カエル', flog.object))

    const cloverEvent1 = async () => {
      await speakFlog(t('events.clover.flog1'))
      state.clover = CLOVER_STEPS.STARTED
    }
    const cloverEvent2 = async () => {
      const give = await uiScene.setSelector(t('events.clover.flog2.options')) === 0
      if (give) {
        const scripts = t('events.clover.flog2.end1')
        bag.removeItem('clover4')
        uiScene.log.push(scripts.shift())
        await speakFlog(scripts)
      } else {
        const scripts = t('events.clover.flog2.end2')
        await speakFlog(scripts)
      }
      await field.addObject({ type: 'Substance', name: 'apple', x: flog.object.x, y: flog.object.y }).then(v => v.drop())
      state.clover = CLOVER_STEPS.COMPLETED
    }
    const cloverEvent3 = async () => {
      await speakFlog(t('events.clover.flog3'))
    }
    flog.setTapEvent(async () => {
      if (state.clover === CLOVER_STEPS.COMPLETED) return await cloverEvent3()
      if (state.clover === CLOVER_STEPS.STARTED && bag.hasItem('clover4')) return await cloverEvent2()
      return await cloverEvent1()
    })
  }
}

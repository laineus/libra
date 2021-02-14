import { inject } from 'vue'
import Talker from '@/util/Talker'
import { PAINTER_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'libra',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const pumpkin = field.getObjectById(4)
    pumpkin?.setTapEvent(async () => {
      const speakPumpkin = talk.getSpeakScripts(new Talker(t('name.pumpkin'), pumpkin.object))
      if (state.events.painter < PAINTER_STEPS.SOLVED) {
        await speakPumpkin(t('events.collector.start'))
        if (!bag.hasItem('art15')) return
        const give = await uiScene.setSelector(t('events.collector.options')) === 0
        if (!give) return
        await speakPumpkin(t('events.collector.solve1'))
        bag.removeItem('art15')
        uiScene.log.push(t('events.collector.log'))
        await speakPumpkin(t('events.collector.solve2'))
        field.dropItem('coinGold', pumpkin.object)
        field.dropItem('coinGold', pumpkin.object)
        field.dropItem('coinSilver', pumpkin.object)
        field.dropItem('coinSilver', pumpkin.object)
        field.dropItem('coinSilver', pumpkin.object)
        await field.dropItem('apple', pumpkin.object)
        state.events.painter = PAINTER_STEPS.SOLVED
      } else {
        await speakPumpkin(t('events.collector.solved'))
      }
    })
  }
}

import { inject } from 'vue'
import Talker from '@/util/Talker'
import { PAINTER_STEPS } from '@/data/eventSteps'
export default {
  name: '豪邸2',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const pumpkin = field.getObjectById(4)
    const speakPumpkin = talk.getSpeakScripts(new Talker('カボチャ', pumpkin.object))

    pumpkin.setTapEvent(async () => {
      if (state.events.painter < PAINTER_STEPS.SOLVED) {
        await speakPumpkin(t('events.collector.start'))
        if (!bag.hasItem('illustLove')) return
        const give = await uiScene.setSelector(t('events.collector.options')) === 0
        if (!give) return
        await speakPumpkin(t('events.collector.solve1'))
        bag.removeItem('illustLove')
        await speakPumpkin(t('events.collector.solve2'))
        await field.dropItem('apple', penguin.object)
        await field.dropItem('coinGold', penguin.object)
        await field.dropItem('coinGold', penguin.object)
        await field.dropItem('coinSilver', penguin.object)
        await field.dropItem('coinSilver', penguin.object)
        await field.dropItem('coinSilver', penguin.object)
        state.events.painter = PAINTER_STEPS.SOLVED
      } else {
        await speakPumpkin(t('events.collector.solved'))
      }
    })
  }
}

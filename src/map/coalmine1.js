import { inject } from 'vue'
import Talker from '@/util/Talker'
import { APPRECIATION_STEPS, REGAIN_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'mary',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const penguin = field.getObjectById(4)
    penguin?.setTapEvent(async () => {
      const speakPenguin = talk.getSpeakScripts(new Talker(t('name.minePenguin'), penguin.object))
      if (state.events.appreciation < APPRECIATION_STEPS.STARTED) {
        await speakPenguin(t('events.miner.greet'))
      } else if (state.events.appreciation === APPRECIATION_STEPS.STARTED) {
        await speakPenguin(t('events.miner.greet'))
        if (!bag.hasItem('art16')) return
        const give = await uiScene.setSelector(t('events.miner.options')) === 0
        if (!give) return
        bag.removeItem('art16')
        uiScene.log.push(t('events.miner.log'))
        await speakPenguin(t('events.miner.solve'))
        state.events.appreciation = APPRECIATION_STEPS.SOLVED
      } else if (state.events.appreciation >= APPRECIATION_STEPS.SOLVED) {
        // regain
        if (state.events.regain === REGAIN_STEPS.NULL) {
          await speakPenguin(t('events.miner.greet'))
          const regain = await uiScene.setSelector(t('events.miner.regain.options1')) === 0
          if (!regain) return
          await speakPenguin(t('events.miner.regain.start'))
          state.events.regain = REGAIN_STEPS.STARTED
        } else if (state.events.regain === REGAIN_STEPS.STARTED) {
          const hasGems = bag.hasItem('sapphire') && bag.hasItem('emerald') && bag.hasItem('amethyst') && bag.hasItem('ruby')
          if (!hasGems) return await speakPenguin(t('events.miner.regain.start'))
          const give = await uiScene.setSelector(t('events.miner.regain.options2')) === 0
          if (!give) return
          bag.removeItem('sapphire')
          bag.removeItem('emerald')
          bag.removeItem('amethyst')
          bag.removeItem('ruby')
          uiScene.log.push(...t('events.miner.regain.logs'))
          await speakPenguin(t('events.miner.regain.complete'))
          await field.dropItem('art16', penguin.object)
          state.events.regain = REGAIN_STEPS.COMPLETED
        } else if (state.events.regain === REGAIN_STEPS.COMPLETED) {
          await speakPenguin(t('events.miner.regain.greet'))
        }
      }
    })
  }
}

import { inject } from 'vue'
import { PITY_STEPS } from '@/data/eventSteps'
import Talker from '@/util/Talker'
export default {
  name: '氷4',
  async create () {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const bag = inject('bag')

    const hachi = field.getObjectById(4)
    hachi?.setTapEvent(async () => {
      const speakHachi = talk.getSpeakScripts(new Talker(t('name.penguin'), hachi.object))
      if (state.events.pityPenguin < PITY_STEPS.FOUND) {
        await speakHachi(t('events.pityPenguin.greet'))
      } else if (state.events.pityPenguin === PITY_STEPS.FOUND) {
        await speakHachi(t('events.pityPenguin.greet'))
        if (!bag.hasItem('pityLetter')) return
        const hasGardenia = bag.hasItem('gardenia')
        const options = t('events.pityPenguin.options')
        if (!hasGardenia) options.shift()
        const opt = await uiScene.setSelector(options)
        if (opt === (options.length - 1)) return // なんでもない
        bag.removeItem('pityLetter')
        uiScene.log.push(t('events.pityPenguin.log1'))
        if (hasGardenia && opt === 0) {
          // 手紙とクチナシ
          bag.removeItem('gardenia')
          uiScene.log.push(t('events.pityPenguin.log2'))
          await speakHachi(t('events.pityPenguin.solve1'))
          const reactions = t('events.pityPenguin.reactions')
          const reaction1 = await uiScene.setSelector(reactions) === 0
          if (reaction1) {
            await speakHachi(t('events.pityPenguin.answer1'))
          } else {
            await speakHachi(t('events.pityPenguin.answer2'))
          }
          await speakHachi(t('events.pityPenguin.solve2'))
        } else {
          // 手紙のみ
          await speakHachi(t('events.pityPenguin.solve3'))
        }
        await field.dropItem('apple', hachi.object)
        state.events.pityPenguin = PITY_STEPS.SOLVED
      } else if (state.events.pityPenguin >= PITY_STEPS.SOLVED) {
        await speakHachi(t('events.pityPenguin.solved'))
      }
    })
  }
}

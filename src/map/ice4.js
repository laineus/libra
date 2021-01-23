import { inject } from 'vue'
import { PITY_STEPS } from '@/map/ice1'
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
    const speakHachi = talk.getSpeakScripts(new Talker('ペンギン', anton.object))

    hachi.setTapEvent(async () => {
      if (state.events.pityPenguin < PITY_STEPS.FOUND) {
        await speakHachi(t('events.pityPenguin.greet'))
      } else if (state.events.pityPenguin === PITY_STEPS.FOUND) {
        await speakHachi(t('events.pityPenguin.greet'))
        if (!bag.hasItem('pityLetter')) return
        const hasGardenia = bag.hasGardenia('gardenia')
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
          await speakHachi(t('events.pityPenguinFriend.solve1'))
          const reactions = t('events.pityPenguinFriend.reactions')
          const reaction1 = await uiScene.setSelector(reactions) === 0
          if (reaction1) {
            await speakHachi(t('events.pityPenguinFriend.answer1'))
          } else {
            await speakHachi(t('events.pityPenguinFriend.answer2'))
          }
          await speakHachi(t('events.pityPenguinFriend.solve2'))
        } else {
          // 手紙のみ
          await speakHachi(t('events.pityPenguinFriend.solve3'))
        }
        await field.dropItem('apple')
        state.events.pityPenguin = PITY_STEPS.SOLVED
      } else if (state.events.pityPenguin >= PITY_STEPS.SOLVED) {
        await speakHachi(t('events.pityPenguinFriend.solved'))
      }
    })
  }
}

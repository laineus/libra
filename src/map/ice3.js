import { inject } from 'vue'
import { EEL_STEPS, PITY_STEPS } from '@/data/eventSteps'
import Talker from '@/util/Talker'
export default {
  name: '氷3',
  async create () {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const bag = inject('bag')

    // EEL
    const anton = field.getObjectById(3)
    anton?.setTapEvent(async () => {
      const speakAnton = talk.getSpeakScripts(new Talker('アントン先生', anton.object))
      if (state.events.eel < EEL_STEPS.STARTED) {
        return await speakAnton(t('events.anton.start1'))
      } else if (state.events.eel === EEL_STEPS.STARTED) {
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
          await speakAnton(t('events.anton.answer2_1'))
          await uiScene.transition(1000).then(complete => complete())
          await speakAnton(t('events.anton.answer2_2'))
          field.dropItem('unadon', anton.object)
          await field.dropItem('antonLetter', anton.object)
        } else {
          await speakAnton(t('events.anton.answer1_1'))
          await uiScene.transition(1000).then(complete => complete())
          await speakAnton(t('events.anton.answer1_2'))
          await field.dropItem('unadon', anton.object)
        }
        state.events.eel = EEL_STEPS.SOLVED
      } else if (state.events.eel === EEL_STEPS.SOLVED) {
        await speakAnton(t('events.anton.solved'))
      } else if (state.events.eel > EEL_STEPS.SOLVED) {
        await speakAnton(t('events.anton.start1'))
      }
    })

    // PITY
    const friend = field.getObjectById(4)
    friend?.setTapEvent(async () => {
      const speakFriend = talk.getSpeakScripts(new Talker('ペンギン', friend.object))
      if (state.events.pityPenguin === PITY_STEPS.NULL) {
        const scripts = t('events.pityPenguinFriend.start1').concat(t('events.pityPenguinFriend.start2'))
        await speakFriend(scripts)
        state.events.pityPenguin = PITY_STEPS.STARTED
      } else if (state.events.pityPenguin === PITY_STEPS.STARTED) {
        if (bag.hasItem('gardenia')) {
          await speakFriend(t('events.pityPenguinFriend.found1'))
          await field.dropItem('pityLetter', friend.object)
          state.events.pityPenguin = PITY_STEPS.FOUND
        } else {
          await speakFriend(t('events.pityPenguinFriend.start2'))
        }
      } else if (state.events.pityPenguin === PITY_STEPS.FOUND) {
        if (bag.hasItem('pityLetter', 1, { bag: true, room: true, field: true })) {
          await speakFriend(t('events.pityPenguinFriend.found2'))
        } else {
          await speakFriend(t('events.pityPenguinFriend.lost'))
          await field.dropItem('pityLetter', friend.object)
        }
      } else if (state.events.pityPenguin === PITY_STEPS.SOLVED) {
        await speakFriend(t('events.pityPenguinFriend.solved'))
        state.events.pityPenguin = PITY_STEPS.COMPLETED
      } else if (state.events.pityPenguin === PITY_STEPS.COMPLETED) {
        await speakFriend(t('events.pityPenguinFriend.completed'))
      }
    })
  }
}

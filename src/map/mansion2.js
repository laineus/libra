import { inject } from 'vue'
import Talker from '@/util/Talker'
import { MAIN_STEPS, PAINTER_STEPS, RAPTOR_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'madp',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    if (state.events.main < MAIN_STEPS.HEART) {
      field.getObjectById(1).setEvent(async () => uiScene.log.push(t('events.block.common')))
      field.getObjectById(2).setEvent(async () => uiScene.log.push(t('events.block.common')))
    }

    if (state.events.painter >= PAINTER_STEPS.SOLVED) {
      field.addObject({ name: 'art15', x: field.positions.art15.x, y: field.positions.art15.y })
    }

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
        await field.dropItem('coinSilver', pumpkin.object)
        state.events.painter = PAINTER_STEPS.SOLVED
      } else {
        await speakPumpkin(t('events.collector.solved'))
      }
    })
    const mania = field.getObjectById(31)
    mania?.setTapEvent(async () => {
      const speak = talk.getSpeakScripts(new Talker(t('name.pumpkin'), mania.object))
      if (state.events.raptor === RAPTOR_STEPS.NULL) {
        await speak(t('events.raptor.start'))
        uiScene.log.push(t('ui.questStart', t('quest.raptor')))
        state.events.raptor = RAPTOR_STEPS.STARTED
      } else if (state.events.raptor === RAPTOR_STEPS.STARTED) {
        if (bag.hasItem('raptor')) {
          await speak(t('events.raptor.give'))
          const give = await uiScene.setSelector(t('events.raptor.options')) === 0
          if (give) {
            bag.removeItem('raptor')
            uiScene.log.push(t('events.raptor.log'))
            await speak(t('events.raptor.gave'))
            await field.dropItem('apple', mania.object)
            state.events.raptor = RAPTOR_STEPS.COMPLETED
            uiScene.log.push(t('ui.questComplete', t('quest.raptor')))
          } else {
            return await speak(t('events.raptor.cancel'))
          }
        } else if ((7).toArray().every(i => bag.hasItem(`raptor${i + 1}`))) {
          await speak(t('events.raptor.advice'))
        } else {
          await speak(t('events.raptor.start'))
        }
      } else if (state.events.raptor === RAPTOR_STEPS.COMPLETED) {
        await speak(t('events.raptor.completed'))
      }
    })
  }
}

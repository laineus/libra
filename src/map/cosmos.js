import { inject } from 'vue'
import Talker from '@/util/Talker'
import { PHOTOSYNTHESIS_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'akai',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')
    state.events.cosmos = true

    const guide = field.getObjectById(3)
    guide?.setRandomWalk()
    guide?.setTapEvent(async () => {
      const speak = talk.getSpeakScripts(new Talker(t('name.grey2'), guide.object))
      await speak(t('events.cosmos.guide2'))
    })

    const evolution = field.getObjectById(7)
    evolution?.setRandomWalk()
    evolution?.setTapEvent(async () => {
      const speak = talk.getSpeakScripts(new Talker(t('name.grey1'), evolution.object))
      await speak(t('events.cosmos.evolution'))
    })

    const hangry = field.getObjectById(6)
    hangry?.setRandomWalk()
    hangry?.setTapEvent(async () => {
      const STEPS = PHOTOSYNTHESIS_STEPS
      const speak = talk.getSpeakScripts(new Talker(t('name.grey1'), hangry.object))
      if (state.events.photosynthesis === STEPS.NULL) {
        await speak(t('events.photosynthesis.greeting'))
      }
      if (state.events.photosynthesis < STEPS.STARTED) {
        const q1 = await uiScene.setSelector(t('events.photosynthesis.questions')) === 0
        await speak(q1 ? t('events.photosynthesis.answer1') : t('events.photosynthesis.answer2'))
        if (q1) {
          state.events.photosynthesis = state.events.photosynthesis === STEPS.QUESTION2 ? STEPS.STARTED : STEPS.QUESTION1
        } else {
          state.events.photosynthesis = state.events.photosynthesis === STEPS.QUESTION1 ? STEPS.STARTED : STEPS.QUESTION2
        }
      }
      if (state.events.photosynthesis === STEPS.STARTED) {
        const ate = state.events.photosynthesisAte
        await speak(ate.length ? t('events.photosynthesis.started') : t('events.photosynthesis.start'))
        const foods = ['omurice', 'steak', 'stirFry', 'curry']
        const options = foods.filter(v => bag.hasItem(v) && !ate.includes(v))
        if (!options.length) return
        const optionTexts = options.map(key => t('events.photosynthesis.option', t(`item.${key}`)))
        const i = await uiScene.setSelector(optionTexts)
        const key = options[i]
        state.events.photosynthesisAte.push(key)
        uiScene.log.push(t('events.photosynthesis.log', t(`item.${key}`)))
        bag.removeItem(key)
        await speak(t(`events.photosynthesis.${key}`))
        if (ate.length >= foods.length) {
          await speak(t('events.photosynthesis.complete'))
          await field.dropItem('apple', hangry.object)
          await speak(t('events.photosynthesis.completed'))
          state.events.photosynthesis = STEPS.COMPLETED
        }
      } else if (state.events.photosynthesis === STEPS.COMPLETED) {
        await speak(t('events.photosynthesis.completed'))
      }
    })
  }
}

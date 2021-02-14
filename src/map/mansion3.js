import { inject } from 'vue'
import Talker from '@/util/Talker'
import config from '@/data/config'
import { BEAUTY_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'libra',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const lady1 = field.getObjectById(2)
    lady1?.setTapEvent(async () => {
      const speakLady1 = talk.getSpeakScripts(new Talker(t('name.pumpkin'), lady1.object))
      if (state.events.beauty === BEAUTY_STEPS.NULL) {
        await speakLady1(t('events.lady1.start'))
        uiScene.log.push(t('ui.questStart', t('quest.beauty')))
        state.events.beauty = BEAUTY_STEPS.STARTED
      } else if (state.events.beauty === BEAUTY_STEPS.STARTED) {
        if (!bag.hasItem('elixir')) return await speakLady1(t('events.lady1.started'))
        const give = await uiScene.setSelector(t('events.lady1.options')) === 0
        if (!give) return
        bag.removeItem('elixir')
        uiScene.log.push(t('events.lady1.log'))
        await speakLady1(t('events.lady1.solve1'))
        const completeTransition = await uiScene.transition(1000, { color: config.COLORS.white })
        await completeTransition()
        await speakLady1(t('events.lady1.solve2'))
        field.dropItem('coinGold', lady1.object)
        field.dropItem('coinGold', lady1.object)
        field.dropItem('coinGold', lady1.object)
        field.dropItem('coinSilver', lady1.object)
        field.dropItem('coinSilver', lady1.object)
        field.dropItem('coinSilver', lady1.object)
        await field.dropItem('coinSilver', lady1.object)
        state.events.beauty = BEAUTY_STEPS.SOLVED
      } else if (state.events.beauty === BEAUTY_STEPS.SOLVED) {
        await speakLady1(t('events.lady1.solved'))
      }
    })
    lady1?.setDestroyEvent(() => {
      if (state.events.beauty === BEAUTY_STEPS.SOLVED) {
        state.events.beauty = BEAUTY_STEPS.EXECUTED
      }
    })

    let lady2MissionStarted = false
    const lady2 = field.getObjectById(3)
    lady2?.setTapEvent(async () => {
      const speakLady2 = talk.getSpeakScripts(new Talker(t('name.pumpkin'), lady2.object))
      if (state.events.beauty < BEAUTY_STEPS.SOLVED) {
        await speakLady2(t('events.lady2.greet'))
      } else if (state.events.beauty === BEAUTY_STEPS.SOLVED) {
        await speakLady2(lady2MissionStarted ? t('events.lady2.started') : t('events.lady2.start'))
        lady2MissionStarted = true
      } else if (state.events.beauty === BEAUTY_STEPS.EXECUTED) {
        await speakLady2(t('events.lady2.complete1'))
        await field.dropItem('apple', lady2.object)
        await speakLady2(t('events.lady2.complete2'))
        uiScene.log.push(t('ui.questComplete', t('quest.beauty')))
        state.events.beauty = BEAUTY_STEPS.COMPLETED
      } else if (state.events.beauty === BEAUTY_STEPS.COMPLETED) {
        await speakLady2(t('events.lady2.completed'))
      }
    })
  }
}

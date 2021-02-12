import { inject } from 'vue'
import Talker from '@/util/Talker'
import { MAIN_STEPS } from '@/data/eventSteps'
export default {
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const libra = inject('player').value
    const event = inject('event')

    const kajitsu = field.getObjectById(3)
    const tLibra = new Talker(t('name.libra'), libra.object)
    const tKajitsu = new Talker(t('name.kajitsu'), kajitsu.object)
    const speakLibra = talk.getSpeakScripts(tLibra)
    const speakKajitsu = talk.getSpeakScripts(tKajitsu)

    kajitsu.setVisible(false)

    if (state.events.main === MAIN_STEPS.CROSSING) {
      kajitsu.setVisible(true)
      event.exec(async () => {
        await sleep(500)
        await libra.setTargetPosition(field.positions.relay.x, field.positions.relay.y)
        kajitsu.lookTo('left')
        await libra.setTargetPosition(field.positions.center.x, field.positions.center.y)
        await sleep(1000)
        await speakKajitsu(t('events.heart.start1'))
        await sleep(500)
        libra.lookTo('right')
        await sleep(500)
        await speakKajitsu(t('events.heart.start2'))
        await speakLibra(t('events.libra.exclamation'))
        await sleep(500)
        await speakKajitsu(t('events.heart.start3'))
        await speakLibra(t('events.libra.silence'))
        await speakKajitsu(t('events.heart.start4'))
        const completeTransition = await uiScene.transition(1000)
        libra.lookTo('up')
        kajitsu.setVisible(false)
        state.events.main = MAIN_STEPS.HEART
        await completeTransition()
      })
    }
    if (state.events.main === MAIN_STEPS.BRAIN) {
      kajitsu.setVisible(true)
      event.exec(async () => {
        await sleep(500)
        await libra.setTargetPosition(field.positions.relay.x, field.positions.relay.y)
        kajitsu.lookTo('left')
        await libra.setTargetPosition(field.positions.center.x, field.positions.center.y)
        await sleep(1000)
        await speakKajitsu(t('events.dream.kajitsu1'))
        libra.lookTo('right')
        await sleep(500)
        await speakKajitsu(t('events.dream.kajitsu2'))
        await speakLibra(t('events.libra.silence'))
        await speakKajitsu(t('events.dream.kajitsu3'))
        const cancel = await uiScene.setSelector(t('events.dream.yesno')) === 1
        if (cancel) {
          await speakKajitsu(t('events.dream.cancel'))
          const completeTransition = await uiScene.transition(1000)
          kajitsu.setVisible(false)
          await completeTransition()
          return
        }
      })
    }
  }
}

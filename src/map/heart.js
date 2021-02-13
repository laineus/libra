import { inject } from 'vue'
import Talker from '@/util/Talker'
import { MAIN_STEPS } from '@/data/eventSteps'
import config from '@/data/config'
export default {
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const libra = inject('player').value
    const event = inject('event')

    const kajitsu = field.getObjectById(3)
    const amili = field.getObjectById(6)
    const speakLibra = talk.getSpeakScripts(new Talker(t('name.libra'), libra.object))
    const speakKajitsu = talk.getSpeakScripts(new Talker(t('name.kajitsu'), kajitsu.object))
    const speakAmili = talk.getSpeakScripts(new Talker(t('name.amili'), amili.object))

    kajitsu.setVisible(false)
    amili.setVisible(false)

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
        // await sleep(1500)
        // await libra.setTargetPosition(field.positions.relay.x, field.positions.relay.y)
        // kajitsu.lookTo('left')
        // await libra.setTargetPosition(field.positions.center.x, field.positions.center.y)
        // await sleep(1000)
        // await speakKajitsu(t('events.dream.kajitsu1'))
        // libra.lookTo('right')
        // await sleep(500)
        // await speakKajitsu(t('events.dream.kajitsu2'))
        // await speakLibra(t('events.libra.silence'))
        // await speakKajitsu(t('events.dream.kajitsu3'))
        // const cancel = await uiScene.setSelector(t('events.dream.yesno')) === 1
        // if (cancel) {
        //   await speakKajitsu(t('events.dream.cancel'))
        //   const completeTransition = await uiScene.transition(1000)
        //   kajitsu.setVisible(false)
        //   libra.lookTo('up')
        //   await completeTransition()
        //   return
        // }
        // await speakKajitsu(t('events.dream.kajitsu4'))
        // await sleep(500)
        // libra.lookTo('up')
        // await sleep(500)
        // await speakLibra(t('events.libra.silence'))
        // await sleep(500)
        const white = await uiScene.transition(6000, { color: config.COLORS.white, alpha: 0.5, depth: config.DEPTH.TALK - 1, hold: 0 })
        const black = await uiScene.transition(700, { color: config.COLORS.black, alpha: 1 })
        uiScene.setScreenMessage(t('events.dream.message'))
        await sleep(2500)
        uiScene.setScreenMessage(null)
        kajitsu.setVisible(false)
        amili.setVisible(true)
        amili.lookTo('left')
        await black()
        libra.lookTo('right')
        await speakLibra(t('events.libra.exclamation'))
        await speakAmili(t('events.dream.amili1'))
        await white(500, { alpha: 0.6, destroy: false })
        await speakAmili(t('events.dream.amili2'))
        await speakLibra(t('events.libra.exclamation'))
        await white(500, { alpha: 0.65, destroy: false })
        await speakAmili(t('events.dream.amili3'))
        await white(500, { alpha: 0.7, destroy: false })
        await speakAmili(t('events.dream.amili4'))
        await white(500, { alpha: 0.75, destroy: false })
        await speakAmili(t('events.dream.amili5'))
        await white(500, { alpha: 0.8, destroy: false })
        await speakAmili(t('events.dream.amili6'))
        await white(500, { alpha: 0.85, destroy: false })
        await speakAmili(t('events.dream.amili7'))
        await white(500, { alpha: 0.9, destroy: false })
        const options = async () => {
          if (state.status.heart >= 5 && state.status.body < 5) {
            await uiScene.setSelector(t('events.dream.options').slice(0, 1))
            return 0
          } else if (state.status.body >= 5 && state.status.heart < 5) {
            await uiScene.setSelector(t('events.dream.options').slice(1))
            return 1
          } else {
            return await uiScene.setSelector(t('events.dream.options'))
          }
        }
        const awake = await options() === 0
        if (awake) {
          await sleep(1500)
          await speakAmili(t('events.dream.last1.amili1'))
          await sleep(500)
          await white(3000, { alpha: 1, destroy: false })
          await sleep(3000)
          uiScene.setScreenMessage(t('events.dream.last1.message'), 'black')
        }
      })
    }
  }
}

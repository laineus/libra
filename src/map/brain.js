import { inject } from 'vue'
import Talker from '@/util/Talker'
import { MAIN_STEPS } from '@/data/eventSteps'
export default {
  bgm: null,
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const libra = inject('player').value
    const event = inject('event')

    const kajitsu = field.getObjectById(2)
    const tLibra = new Talker(t('name.libra'), libra.object)
    const tKajitsu = new Talker(t('name.kajitsu'), kajitsu.object)
    const speakLibra = talk.getSpeakScripts(tLibra)
    const speakKajitsu = talk.getSpeakScripts(tKajitsu)

    kajitsu.setVisible(false)
    if (state.events.main === MAIN_STEPS.HEART) {
      event.exec(async () => {
        await sleep(600)
        await speakLibra(t('events.libra.exclamation'))
        await libra.setTargetPosition(field.positions.center.x, field.positions.center.y)
        await sleep(500)
        await ['rightUp', 'right', 'rightDown', 'down', 'leftDown', 'left'].reduce((v, key) => {
          return v.then(() => sleep(400).then(() => libra.lookTo(key)))
        }, Promise.resolve())
        await sleep(600)
        await speakLibra(t('events.libra.silence'))
        await sleep(250)
        const completeTransition = await uiScene.transition(500)
        await sleep(500)
        const clear = await uiScene.setScreenMessage(t('events.brain.message'))
        await sleep(2500)
        await clear()
        await sleep(500)
        kajitsu.setVisible(true)
        kajitsu.lookTo('up')
        await completeTransition()
        libra.lookTo('down')
        await speakLibra(t('events.libra.exclamation'))
        await speakKajitsu(t('events.brain.kajitsu1'))
        await speakLibra(t('events.libra.silence'))
        await speakKajitsu(t('events.brain.kajitsu2'))
        await sleep(900)
        await speakKajitsu(t('events.brain.kajitsu3'))
        await speakLibra(t('events.libra.silence'))
        await speakKajitsu(t('events.brain.kajitsu4'))
        await sleep(600)
        await kajitsu.setTargetPosition(field.positions.exit.x, field.positions.exit.y)
        kajitsu.setVisible(false)
        state.events.main = MAIN_STEPS.BRAIN
      })
    }
  }
}

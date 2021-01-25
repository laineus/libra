import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
const STEPS = { NULL: 0, COMPLETED: 1 }
export default {
  name: '暗闇',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const libra = inject('player').value

    const area = field.getObjectById(4)
    const kajitsu = field.getObjectById(5)
    const tLibra = new Talker('リブラ', libra.object)
    const tKajitsu = new Talker('カジツ', kajitsu.object)
    const speakLibra = talk.getSpeakScripts(tLibra)
    const speakKajitsu = talk.getSpeakScripts(tKajitsu)

    kajitsu.setVisible(false)

    const event = async () => {
      await speakLibra(t('events.libra.exclamation'))
      await libra.setTargetPosition((17).toPixelCenter, (16).toPixel)
      await sleep(1000)
      await speakLibra(t('events.libra.silence'))
      const completeTransition = await uiScene.transition(500)
      await sleep(500)
      uiScene.setScreenMessage(t('events.dark.kajitsu1'))
      await sleep(2500)
      uiScene.setScreenMessage(null)
      await sleep(500)
      kajitsu.setVisible(true)
      kajitsu.lookTo('up')
      await completeTransition()
      await sleep(500)
      libra.lookTo('down')
      await speakLibra(t('events.libra.exclamation'))
      await sleep(500)
      await speakKajitsu(t('events.dark.kajitsu2'))
      await speakLibra(t('events.libra.question'))
      await speakKajitsu(t('events.dark.kajitsu3'))
      await sleep(1000)
      await speakKajitsu(t('events.dark.kajitsu4'))
      await speakLibra(t('events.libra.exclamation'))
      await speakKajitsu(t('events.dark.kajitsu5'))
      await kajitsu.setTargetPosition((19).toPixelCenter, (15).toPixelCenter)
      libra.lookTo('right')
      await kajitsu.setTargetPosition((19).toPixelCenter, (14).toPixel)
      libra.lookTo('up')
      await kajitsu.setTargetPosition((16).toPixelCenter, (5).toPixel)
      kajitsu.setVisible(false)
      state.events.dark = STEPS.COMPLETED
    }
    area.setEvent(computed(() => state.events.dark === STEPS.COMPLETED ? null : event))
  }
}

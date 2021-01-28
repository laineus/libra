import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
import { MAIN_STEPS } from './consts'
export default {
  name: '交差点',
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
      await libra.setTargetPosition((27).toPixelCenter, (16).toPixelCenter)
      kajitsu.lookTo('up')
      await sleep(1000)
      await speakLibra(t('events.libra.silence'))
      const completeTransition = await uiScene.transition(500)
      await sleep(500)
      uiScene.setScreenMessage(t('events.crossing.start1'))
      await sleep(2500)
      uiScene.setScreenMessage(null)
      await sleep(500)
      kajitsu.setVisible(true)
      kajitsu.lookTo('left')
      await completeTransition()
      await sleep(500)
      libra.lookTo('right')
      await speakKajitsu(t('events.crossing.start2'))
      await speakLibra(t('events.libra.exclamation'))
      await speakKajitsu(t('events.crossing.start3'))
      await speakLibra(t('events.libra.silence'))
      await speakKajitsu(t('events.crossing.start4'))
      await kajitsu.setTargetPosition((29).toPixelCenter, (12).toPixelCenter)
      libra.lookTo('up')
      await kajitsu.setTargetPosition((27).toPixelCenter, (4).toPixelCenter)
      kajitsu.setVisible(false)
      state.events.main = MAIN_STEPS.CROSSING
    }
    area.setEvent(computed(() => state.events.main < MAIN_STEPS.CROSSING ? event : null))
  }
}
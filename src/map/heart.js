import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
import { MAIN_STEPS } from '@/data/eventSteps'
export default {
  name: '心臓',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const libra = inject('player').value

    const area = field.getObjectById(2)
    const kajitsu = field.getObjectById(3)
    const tLibra = new Talker(t('name.libra'), libra.object)
    const tKajitsu = new Talker(t('name.kajitsu'), kajitsu.object)
    const speakLibra = talk.getSpeakScripts(tLibra)
    const speakKajitsu = talk.getSpeakScripts(tKajitsu)

    kajitsu.setVisible(computed(() => state.events.main < MAIN_STEPS.HEART))

    const event = async () => {
      await libra.setTargetPosition((15).toPixelCenter, (18).toPixel)
      kajitsu.lookTo('left')
      await libra.setTargetPosition((15).toPixelCenter, (16).toPixel)
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
      state.events.main = MAIN_STEPS.HEART
      await completeTransition()
    }
    area.setEvent(computed(() => state.events.main < MAIN_STEPS.HEART ? event : null))
  }
}

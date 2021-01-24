import { inject } from 'vue'
import Talker from '@/util/Talker'
const STEPS = { NULL: 0, COMPLETED: 1 }
export default {
  name: '暗闇',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')
    const libra = inject('player').value

    const area = field.getObjectById(4)
    const kajitsu = field.getObjectById(5)
    const tLibra = new Talker('リブラ', libra.object)
    const tKajitsu = new Talker('カジツ', kajitsu.object)
    const speakLibra = talk.getSpeakScripts(tLibra)
    const speakKajitsu = talk.getSpeakScripts(tKajitsu)
    const talkBoth = (scripts, map) => {
      const list = scripts.map((text, i) => {
        return { chara: map[i], text }
      })
      return talk.setTalk(list)
    }

    area.setEvent(async () => {
      await sleep(1000)
      await speakLibra(t('events.libra.exclamation'))
      await libra.setTargetPosition(libra.object.x, libra.object.y - (4).toPixel)
      await sleep(1000)
    })
  }
}

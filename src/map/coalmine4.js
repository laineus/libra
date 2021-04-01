import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  bgm: 'akai',
  async create () {
    const field = inject('field').value
    const talk = inject('talk').value

    const grey = field.getObjectById(5)
    grey?.setRandomWalk()
    grey?.setTapEvent(async () => {
      const speak = talk.getSpeakScripts(new Talker(t('name.grey1'), grey.object))
      await speak(t('events.cosmos.guide1'))
    })
  }
}

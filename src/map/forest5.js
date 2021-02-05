import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: '森5',
  async create () {
    const field = inject('field').value
    const talk = inject('talk').value

    const torrent = field.getObjectById(2)
    torrent?.setTapEvent(async () => {
      const speakTorrent = talk.getSpeakScripts(new Talker('トレント', torrent.object))
      await speakTorrent(t('events.clover.torrent'))
    })
  }
}

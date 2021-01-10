import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: '森5',
  async create () {
    const field = inject('field').value
    const talk = inject('talk').value

    const torrent = field.getObjectById(2)
    const speakTorrent = talk.getSpeakScripts(new Talker('トレント', torrent.object))

    torrent.setTapEvent(async () => {
      await speakTorrent(t('events.clover.torrent'))
    })
  }
}

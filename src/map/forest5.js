import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  async create () {
    const field = inject('field').value
    const talk = inject('talk').value

    const torrent = field.getObjectById(2)
    torrent?.setTapEvent(async () => {
      const speakTorrent = talk.getSpeakScripts(new Talker(t('name.torrent'), torrent.object))
      await speakTorrent(t('events.clover.torrent'))
    })
  }
}

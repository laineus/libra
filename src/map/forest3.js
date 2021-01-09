import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: '森2',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value

    const torrent = field.getObjectById(3)
    // const flog = field.getObjectById(4)

    const tTorrent = new Talker('NPC', torrent.object)
    const speakTorrent = talk.getSpeakScripts(tTorrent)
    const torrentEvent1 = async () => {
      const scripts = t('events.torrentFlog.torrent1')
      await speakTorrent(scripts.splice(0, 2))
      await uiScene.setSelector(scripts.shift())
      await speakTorrent(scripts.splice(0, 3))
      await uiScene.setSelector(scripts.shift())
      await speakTorrent(scripts)
    }
    torrent.setTapEvent(torrentEvent1)
  }
}

import { inject, computed } from 'vue'
import Talker from '@/util/Talker'
const STEPS = {
  NULL: 0,
  STARTED: 1,
  FOUND: 2,
  GAVE: 3,
  COMPLETED: 4
}
export default {
  name: '森2',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

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
      state.events.torrentFlog = STEPS.STARTED
    }
    const torrentEvent2 = async () => {
      if (bag.hasItem('hercules')) {
        await speakTorrent(t('events.torrentFlog.torrent2.found'))
        state.events.torrentFlog = STEPS.FOUND
      } else {
        await speakTorrent(t('events.torrentFlog.torrent2.started'))
      }
    }
    torrent.setTapEvent(computed(() => {
      if (state.events.torrentFlog === STEPS.NULL) return torrentEvent1
      if (state.events.torrentFlog === STEPS.STARTED) return torrentEvent2
      return null
    }))
  }
}

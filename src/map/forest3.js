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
    const tTorrent = new Talker('トレント', torrent.object)
    const speakTorrent = talk.getSpeakScripts(tTorrent)
    const flog = field.getObjectById(4)
    const tFlog = new Talker('カエル', flog.object)
    const speakFlog = talk.getSpeakScripts(tFlog)

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
    const torrentEvent3 = async () => {
      await speakTorrent('aaa')
      state.events.torrentFlog = STEPS.COMPLETED
    }
    torrent.setTapEvent(computed(() => {
      if (state.events.torrentFlog === STEPS.NULL) return torrentEvent1
      if (state.events.torrentFlog <= STEPS.FOUND) return torrentEvent2
      if (state.events.torrentFlog === STEPS.GAVE) return torrentEvent3
      return async () => speakTorrent('end')
    }))
    flog.setTapEvent(async () => {
      if (state.events.torrentFlog === STEPS.FOUND && bag.hasItem('hercules')) {
        const scripts = t('events.torrentFlog.flog.give')
        await speakFlog(scripts.splice(0, 4))
        const accepted = await uiScene.setSelector(scripts.shift()) === 0
        accepted ? scripts.shift() : await speakFlog(scripts.shift())
        uiScene.log.push(scripts.shift()[accepted ? 0 : 1])
        await speakFlog(scripts.splice(0, 3))
        await uiScene.setSelector(scripts.shift())
        await speakFlog(scripts)
        state.events.torrentFlog = STEPS.GAVE
      } else {
        await speakFlog(t('events.torrentFlog.flog.greeting'))
      }
    })
  }
}

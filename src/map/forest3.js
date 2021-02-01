import { inject, computed } from 'vue'
import Talker from '@/util/Talker'
import { TORRENT_FLOG_STEPS } from '@/data/eventSteps'
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
      state.events.torrentFlog = TORRENT_FLOG_STEPS.STARTED
    }
    const torrentEvent2 = async () => {
      if (bag.hasItem('hercules')) {
        await speakTorrent(t('events.torrentFlog.torrent2.found'))
        state.events.torrentFlog = TORRENT_FLOG_STEPS.FOUND
      } else {
        await speakTorrent(t('events.torrentFlog.torrent2.started'))
      }
    }
    const torrentEvent3 = async () => {
      const scripts = t('events.torrentFlog.torrent3.report')
      const leaked = await uiScene.setSelector(scripts.shift()) === 0
      if (leaked) {
        await speakTorrent(scripts.splice(0, 4))
        const agreed = await uiScene.setSelector(scripts.shift()) === 0
        await speakTorrent(agreed ? t('events.torrentFlog.torrent3.end3') : t('events.torrentFlog.torrent3.end2'))
      } else {
        await speakTorrent(t('events.torrentFlog.torrent3.end1'))
      }
      await field.addObject({ type: 'Substance', name: 'apple', x: torrent.object.x, y: torrent.object.y + 5 }).then(v => v.drop())
      state.events.torrentFlog = TORRENT_FLOG_STEPS.COMPLETED
    }
    torrent.setTapEvent(computed(() => {
      if (state.events.torrentFlog === TORRENT_FLOG_STEPS.NULL) return torrentEvent1
      if (state.events.torrentFlog <= TORRENT_FLOG_STEPS.FOUND) return torrentEvent2
      if (state.events.torrentFlog === TORRENT_FLOG_STEPS.GAVE) return torrentEvent3
      return async () => speakTorrent(t('events.torrentFlog.torrent4'))
    }))
    flog.setTapEvent(async () => {
      if (state.events.torrentFlog === TORRENT_FLOG_STEPS.FOUND && bag.hasItem('hercules')) {
        const scripts = t('events.torrentFlog.flog.give')
        await speakFlog(scripts.splice(0, 4))
        const accepted = await uiScene.setSelector(scripts.shift()) === 0
        accepted ? scripts.shift() : await speakFlog(scripts.shift())
        bag.removeItem('hercules')
        uiScene.log.push(scripts.shift()[accepted ? 0 : 1])
        await speakFlog(scripts.splice(0, 3))
        await uiScene.setSelector(scripts.shift())
        await speakFlog(scripts)
        state.events.torrentFlog = TORRENT_FLOG_STEPS.GAVE
      } else {
        await speakFlog(t('events.torrentFlog.flog.greeting'))
      }
    })
  }
}

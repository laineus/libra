import { inject } from 'vue'
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
    torrent?.setTapEvent(async () => {
      const speakTorrent = talk.getSpeakScripts(new Talker('トレント', torrent.object))
      if (state.events.torrentFlog === TORRENT_FLOG_STEPS.NULL) {
        const scripts = t('events.torrentFlog.torrent1')
        await speakTorrent(scripts.splice(0, 2))
        await uiScene.setSelector(scripts.shift())
        await speakTorrent(scripts.splice(0, 3))
        await uiScene.setSelector(scripts.shift())
        await speakTorrent(scripts)
        state.events.torrentFlog = TORRENT_FLOG_STEPS.STARTED
      } else if (state.events.torrentFlog <= TORRENT_FLOG_STEPS.FOUND) {
        if (bag.hasItem('hercules')) {
          await speakTorrent(t('events.torrentFlog.torrent2.found'))
          state.events.torrentFlog = TORRENT_FLOG_STEPS.FOUND
        } else {
          await speakTorrent(t('events.torrentFlog.torrent2.started'))
        }
      } else if (state.events.torrentFlog === TORRENT_FLOG_STEPS.GAVE) {
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
      } else if (state.events.torrentFlog === TORRENT_FLOG_STEPS.COMPLETED) {
        await speakTorrent(t('events.torrentFlog.torrent4'))
      }
    })

    const flog = field.getObjectById(4)
    flog?.setTapEvent(async () => {
      const speakFlog = talk.getSpeakScripts(new Talker('カエル', flog.object))
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

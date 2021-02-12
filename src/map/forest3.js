import { inject } from 'vue'
import Talker from '@/util/Talker'
import { TORRENT_FLOG_STEPS } from '@/data/eventSteps'
export default {
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const torrent = field.getObjectById(3)
    torrent?.setTapEvent(async () => {
      const speakTorrent = talk.getSpeakScripts(new Talker(t('name.torrent'), torrent.object))
      if (state.events.torrentFlog === TORRENT_FLOG_STEPS.NULL) {
        await speakTorrent(t('events.torrentFlog.start1'))
        await uiScene.setSelector(t('events.torrentFlog.options1'))
        await speakTorrent(t('events.torrentFlog.start2'))
        await uiScene.setSelector(t('events.torrentFlog.options2'))
        await speakTorrent(t('events.torrentFlog.start3'))
        uiScene.log.push(t('ui.questStart', t('quest.torrentFlog')))
        state.events.torrentFlog = TORRENT_FLOG_STEPS.STARTED
      } else if (state.events.torrentFlog <= TORRENT_FLOG_STEPS.FOUND) {
        if (bag.hasItem('hercules')) {
          await speakTorrent(t('events.torrentFlog.found'))
          state.events.torrentFlog = TORRENT_FLOG_STEPS.FOUND
        } else {
          await speakTorrent(t('events.torrentFlog.started'))
        }
      } else if (state.events.torrentFlog === TORRENT_FLOG_STEPS.GAVE) {
        const leaked = await uiScene.setSelector(t('events.torrentFlog.options3')) === 0
        if (leaked) {
          await speakTorrent(t('events.torrentFlog.report'))
          const agreed = await uiScene.setSelector(t('events.torrentFlog.options4')) === 0
          await speakTorrent(agreed ? t('events.torrentFlog.end3') : t('events.torrentFlog.end2'))
        } else {
          await speakTorrent(t('events.torrentFlog.end1'))
        }
        await field.addObject({ type: 'Substance', name: 'apple', x: torrent.object.x, y: torrent.object.y + 5 }).then(v => v.drop())
        uiScene.log.push(t('ui.questComplete', t('quest.torrentFlog')))
        state.events.torrentFlog = TORRENT_FLOG_STEPS.COMPLETED
      } else if (state.events.torrentFlog === TORRENT_FLOG_STEPS.COMPLETED) {
        await speakTorrent(t('events.torrentFlog.completed'))
      }
    })

    const flog = field.getObjectById(4)
    flog?.setTapEvent(async () => {
      const speakFlog = talk.getSpeakScripts(new Talker(t('name.flog'), flog.object))
      if (state.events.torrentFlog === TORRENT_FLOG_STEPS.FOUND && bag.hasItem('hercules')) {
        await speakFlog(t('events.torrentFlog.flog.give1'))
        const accepted = await uiScene.setSelector(t('events.torrentFlog.flog.options1')) === 0
        if (accepted) await speakFlog(t('events.torrentFlog.flog.give2'))
        bag.removeItem('hercules')
        uiScene.log.push(accepted ? t('events.torrentFlog.flog.log1') : t('events.torrentFlog.flog.log2'))
        await speakFlog(t('events.torrentFlog.flog.give3'))
        await uiScene.setSelector(t('events.torrentFlog.flog.options2'))
        await speakFlog(t('events.torrentFlog.flog.give4'))
        state.events.torrentFlog = TORRENT_FLOG_STEPS.GAVE
      } else {
        await speakFlog(t('events.torrentFlog.flog.greeting'))
      }
    })
  }
}

import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
import { STEPS as CURSE_STEPS } from './cave3'
const STEPS = {
  INTRO: 0,
  WALK: 1,
  TALK: 2,
  APPLE: 3,
  COMPLETED: 4
}
export default {
  name: '森2',
  async create () {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const camera = inject('camera').value
    const talk = inject('talk').value
    const { exec } = inject('event')
    const bag = inject('bag')

    const sumStatus = computed(() => state.status.heart + state.status.body)
    const gate = field.getObjectById(1)
    gate.setEvent(computed(() => {
      if (state.events.intro < STEPS.COMPLETED) return async () => uiScene.log.push('この先へはまだ行けません')
      return false
    }))
    const kajitsu = field.getObjectById(2)
    kajitsu.setCapturable(false)
    kajitsu.setVisible(computed(() => state.events.intro < STEPS.COMPLETED))
    const area = field.getObjectById(5)
    const mountApple = () => field.addObject({ type: 'Substance', name: 'apple', x: field.positions.apple.x, y: field.positions.apple.y })
    if (sumStatus.value > 0 ? Math.chance(0.01) : !bag.hasItem('apple', 1, { room: true, bag: true })) {
      mountApple()
    }

    const tKajitsu = new Talker('カジツ', kajitsu.object)

    // Auto start event
    if (state.events.intro === STEPS.INTRO) {
      exec(async () => {
        await sleep(1000)
        const revert = await camera.move(0, -100, 2000)
        await sleep(500)
        const walk = t('events.forest2Kajitsu.walk')
        await talk.setTalk([
          { chara: tKajitsu, text: walk.shift() },
          { chara: tKajitsu, text: walk.shift() },
          { chara: tKajitsu, text: walk.shift() },
          { chara: tKajitsu, text: walk.shift() },
          { chara: tKajitsu, text: walk.shift() }
        ])
        await revert()
        state.events.intro = STEPS.WALK
      })
    }

    // Area event
    const areaEvent = computed(() => {
      if (state.events.intro !== STEPS.WALK) return
      return async () => {
        const talking = t('events.forest2Kajitsu.talk')
        await talk.setTalk([
          { chara: tKajitsu, text: talking.shift() },
          { chara: tKajitsu, text: talking.shift() },
          { chara: tKajitsu, text: talking.shift() }
        ])
        state.events.intro = STEPS.TALK
      }
    })
    area.setEvent(areaEvent)

    // Talk Events
    const kajitsuEvent = computed(() => {
      if (state.events.intro === STEPS.TALK) {
        return async () => {
          mountApple()
          state.events.intro = STEPS.APPLE
          const apl = t('events.forest2Kajitsu.apple')
          await talk.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
          const revert = await camera.move(100, -200, 2000)
          await sleep(500)
          await talk.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
          await revert()
        }
      } else if (state.events.intro === STEPS.APPLE && !bag.hasItem('apple')) {
        return async () => {
          const apl = t('events.forest2Kajitsu.apple').slice(2)
          await talk.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
        }
      } else if (state.events.intro === STEPS.APPLE) {
        return async () => {
          const completed = t('events.forest2Kajitsu.completed')
          await talk.setTalk([
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() }
          ])
          const completeTransition = await uiScene.transition(1000)
          state.events.intro = STEPS.COMPLETED
          await completeTransition()
        }
      }
    })
    kajitsu.setTapEvent(kajitsuEvent)

    // ----------------------------------------------------------------------------------

    const torrent = field.getObjectById(24)
    const speakTorrent = talk.getSpeakScripts(new Talker('トレント', torrent.object))
    torrent.setVisible(computed(() => state.events.curse >= CURSE_STEPS.STARTED))
    const execCurse = async () => {
      if (bag.hasItem('strawDoll')) {
        await speakTorrent(t('events.curser.exec1'))
        await uiScene.transition(1000).then(complete => complete())
        state.events.curse = CURSE_STEPS.EXECUTED
        await speakTorrent(t('events.curser.exec2'))
      } else {
        await speakTorrent(t('events.curser.failed'))
      }
    }
    torrent.setTapEvent(async () => {
      if (state.events.curse === CURSE_STEPS.STARTED) {
        await speakTorrent(t('events.curser.start'))
        state.events.curse = CURSE_STEPS.TALKED_TORRENT
        const wannaCurse = await uiScene.setSelector(t('events.curser.options')) === 0
        wannaCurse ? await execCurse() : await speakTorrent(t('events.curser.cancel'))
      } else {
        await speakTorrent(t('events.curser.greet'))
        if (state.events.curse === CURSE_STEPS.TALKED_TORRENT) {
          const wannaCurse = await uiScene.setSelector(t('events.curser.options2')) === 1
          if (wannaCurse) await execCurse()
        }
      }
    })
  }
}

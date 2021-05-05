import { computed, inject, watch } from 'vue'
import Talker from '@/util/Talker'
import { INTRO_STEPS, CURSE_STEPS } from '@/data/eventSteps'
export default {
  bgm: 'toaru',
  async create () {
    const state = inject('storage').state
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const camera = inject('camera').value
    const talk = inject('talk').value
    const audio = inject('audio')
    const { exec } = inject('event')
    const bag = inject('bag')
    const mobile = inject('mobile')
    const killed = computed(() => state.killed.length > 0)
    if (!killed.value) {
      field.delObject(48)
      field.delObject(49)
    }

    const sumStatus = computed(() => state.status.heart + state.status.body)
    const gate = field.getObjectById(1)
    gate.setEvent(computed(() => {
      if (state.events.intro < INTRO_STEPS.COMPLETED) return async () => uiScene.log.push(t('events.block.common'))
      return false
    }))
    const kajitsu = field.getObjectById(2)
    kajitsu.setCapturable(false)
    kajitsu.setVisible(computed(() => state.events.intro < INTRO_STEPS.COMPLETED))
    const area = field.getObjectById(5)
    const mountApple = () => field.addObject({ name: 'apple', x: field.positions.apple.x, y: field.positions.apple.y })
    if ((state.events.intro === INTRO_STEPS.APPLE || (sumStatus.value > 0 && Math.chance(0.01))) && !bag.hasItem('apple', 1, { room: true, bag: true })) {
      mountApple()
    }

    const speakKajitsu = talk.getSpeakScripts(new Talker(t('name.kajitsu'), kajitsu.object))
    const env = mobile ? 'sp' : 'pc'

    // Auto start event
    if (state.events.intro === INTRO_STEPS.INTRO) {
      audio.setBgm(null)
      exec(async () => {
        await sleep(1000)
        const revert = await camera.move(0, -100, 2000)
        await sleep(500)
        await speakKajitsu(t('events.forest2Kajitsu.greet'))
        await speakKajitsu(t(`events.forest2Kajitsu.walk.${env}`))
        await revert()
        state.events.intro = INTRO_STEPS.WALK
      })
    }

    // Area event
    const areaEvent = computed(() => {
      if (state.events.intro !== INTRO_STEPS.WALK) return
      return async () => {
        await speakKajitsu(t('events.forest2Kajitsu.talk1'))
        await speakKajitsu(t(`events.forest2Kajitsu.talk2.${env}`))
        state.events.intro = INTRO_STEPS.TALK
      }
    })
    area.setEvent(areaEvent)

    // Talk Events
    const kajitsuEvent = computed(() => {
      if (state.events.intro === INTRO_STEPS.TALK) {
        return async () => {
          mountApple()
          state.events.intro = INTRO_STEPS.APPLE
          await speakKajitsu(t('events.forest2Kajitsu.apple1'))
          const revert = await camera.move(100, -200, 2000)
          await sleep(500)
          await speakKajitsu(t(`events.forest2Kajitsu.apple2.${env}`))
          await revert()
        }
      } else if (state.events.intro === INTRO_STEPS.APPLE && !bag.hasItem('apple')) {
        return async () => {
          await speakKajitsu(t(`events.forest2Kajitsu.apple2.${env}`))
        }
      } else if (state.events.intro === INTRO_STEPS.APPLE) {
        return async () => {
          await speakKajitsu(t('events.forest2Kajitsu.completed'))
          const completeTransition = await uiScene.transition(1000)
          state.events.intro = INTRO_STEPS.COMPLETED
          await completeTransition()
        }
      }
    })
    kajitsu.setTapEvent(kajitsuEvent)

    // ----------------------------------------------------------------------------------

    const torrent = field.getObjectById(24)
    if (torrent) {
      const speakTorrent = talk.getSpeakScripts(new Talker(t('name.torrent'), torrent.object))
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
    // Store items
    const items = computed(() => field.objects.filter(v => v.type === 'Substance'))
    this.stopWatch = watch(() => items.value.length, (newLength, oldLength) => {
      if (!killed.value) return
      const add = newLength > oldLength
      if (!add) return
      const item = items.value[items.value.length - 1]
      if (['coinSilver', 'coinGold'].includes(item.name) && item.x > 470 && item.x < 522 && item.y > 279 && item.y < 315) {
        state.killed = []
        uiScene.log.push(t('ui.revive'))
      }
    })
  },
  destroy () {
    this.stopWatch()
  }
}

import { inject } from 'vue'
import Talker from '@/util/Talker'
const STEPS = {
  NULL: 0,
  STARTED: 1,
  TALKED_TORRENT: 2,
  EXECUTED: 3,
  EXECUTED_END: 4,
  NOTICED_DID: 5,
  COMPLETED: 6
}
export default {
  name: '洞窟3',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const leftBat = field.getObjectById(3)
    const rightBat = field.getObjectById(4)
    const tl = new Talker('コウモリ', leftBat.object)
    const tr = new Talker('コウモリ', rightBat.object)
    const speakLeft = talk.getSpeakScripts(tl)
    const speakRight = talk.getSpeakScripts(tr)
    const talkBoth = (scripts, map) => {
      const list = scripts.map((text, i) => {
        return { chara: map[i], text }
      })
      return talk.setTalk(list)
    }
    const dropApple = chara => field.addObject({ type: 'Substance', name: 'apple', x: chara.object.x, y: chara.object.y }).then(v => v.drop())

    const timeEstimated = state.events.curse === STEPS.NOTICED_DID

    const event = async () => {
      if (state.events.curse === STEPS.NULL) {
        await talkBoth(t('events.curse.start1'), [tr, tl, tr])
        if (bag.hasItem('strawDoll')) {
          await talkBoth(t('events.curse.start2'), [tl, tl, tl, tr, tl, tr, tr, tr, tr, tl, tl, tl, tl])
          state.events.curse = STEPS.STARTED
        }
      } else if (state.events.curse === STEPS.STARTED) {
        await speakLeft(t('events.curse.started1'))
      } else if (state.events.curse === STEPS.EXECUTED) {
        await speakLeft(t('events.curse.executed'))
        state.events.curse = STEPS.EXECUTED_END
      } else if (state.events.curse === STEPS.EXECUTED_END) {
        await speakLeft(t('events.curse.completed'))
      } else if (state.events.curse === STEPS.TALKED_TORRENT) {
        const did = await uiScene.setSelector(t('events.curse.noticeOptions')) === 0
        if (did) {
          const scripts = t('events.curse.answer1')
          await speakLeft(scripts.splice(0, 2))
          dropApple(leftBat)
          await talkBoth(scripts, [tr, tl, tr])
          state.events.curse = STEPS.NOTICED_DID
        } else {
          const scripts = t('events.curse.answer2')
          await speakRight(scripts.splice(0, 3))
          dropApple(rightBat)
          await talkBoth(scripts, [tl, tl, tr])
          state.events.curse = STEPS.COMPLETED
        }
      } else if (state.events.curse === STEPS.NOTICED_DID) {
        if (!timeEstimated) {
          return await talkBoth(t('events.curse.noticedDid1'), [tr, tr, tr, tr, tl])
        }
        await talkBoth(t('events.curse.noticedDid2'), [tl, tr])
        state.events.curse = STEPS.COMPLETED
      } else if (state.events.curse === STEPS.COMPLETED) {
        await speakLeft(t('events.curse.completed'))
      }
    }
    speakLeft.setTapEvent(event)
    speakRight.setTapEvent(async () => {
      if (state.events.curse === STEPS.STARTED) {
        return await speakRight(t('events.curse.started2'))
      }
      await event()
    })
  }
}

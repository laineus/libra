import { inject, computed } from 'vue'
import Talker from '@/util/Talker'
import { CURSE_STEPS } from '@/data/eventSteps'
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
    if (!leftBat || !rightBat) return

    const tl = new Talker(t('name.bat'), leftBat.object)
    const tr = new Talker(t('name.bat'), rightBat.object)
    const speakLeft = talk.getSpeakScripts(tl)
    const speakRight = talk.getSpeakScripts(tr)
    const talkBoth = (scripts, map) => {
      const list = scripts.map((text, i) => {
        return { chara: map[i], text }
      })
      return talk.setTalk(list)
    }

    const timeEstimated = state.events.curse === CURSE_STEPS.NOTICED_DID
    rightBat.setVisible(computed(() => ![CURSE_STEPS.EXECUTED, CURSE_STEPS.EXECUTED_END].includes(state.events.curse)))

    const event = async () => {
      if (state.events.curse === CURSE_STEPS.NULL) {
        await talkBoth(t('events.curse.start1'), [tr, tl, tr])
        if (bag.hasItem('strawDoll')) {
          await talkBoth(t('events.curse.start2'), [tl, tl, tl, tr, tl, tr, tr, tr, tr, tl, tl, tl, tl])
          uiScene.log.push(t('ui.questStart', t('quest.curse')))
          state.events.curse = CURSE_STEPS.STARTED
        }
      } else if (state.events.curse === CURSE_STEPS.STARTED) {
        await speakLeft(t('events.curse.started1'))
      } else if (state.events.curse === CURSE_STEPS.EXECUTED) {
        await speakLeft(t('events.curse.executed'))
        uiScene.log.push(t('ui.questComplete', t('quest.curse')))
        state.events.curse = CURSE_STEPS.EXECUTED_END
      } else if (state.events.curse === CURSE_STEPS.EXECUTED_END) {
        await speakLeft(t('events.curse.completed'))
      } else if (state.events.curse === CURSE_STEPS.TALKED_TORRENT) {
        const did = await uiScene.setSelector(t('events.curse.noticeOptions')) === 0
        if (did) {
          await speakLeft(t('events.curse.answer1_1'))
          await field.dropItem('apple', leftBat.object)
          await talkBoth(t('events.curse.answer1_2'), [tr, tl, tr])
          state.events.curse = CURSE_STEPS.NOTICED_DID
        } else {
          await talkBoth(t('events.curse.answer2_1'), [tl, tr, tr])
          await field.dropItem('apple', rightBat.object)
          await talkBoth(t('events.curse.answer2_2'), [tl, tr, tr])
          state.events.curse = CURSE_STEPS.COMPLETED
        }
        uiScene.log.push(t('ui.questComplete', t('quest.curse')))
      } else if (state.events.curse === CURSE_STEPS.NOTICED_DID) {
        if (!timeEstimated) {
          return await talkBoth(t('events.curse.noticedDid1'), [tl, tr])
        }
        await talkBoth(t('events.curse.noticedDid2'), [tr, tr, tr, tr, tl])
        state.events.curse = CURSE_STEPS.COMPLETED
      } else if (state.events.curse === CURSE_STEPS.COMPLETED) {
        await speakLeft(t('events.curse.completed'))
      }
    }
    leftBat.setTapEvent(event)
    rightBat.setTapEvent(async () => {
      if (state.events.curse === CURSE_STEPS.STARTED) {
        return await speakRight(t('events.curse.started2'))
      }
      await event()
    })
  }
}

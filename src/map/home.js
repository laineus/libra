import { inject } from 'vue'
import Talker from '@/util/Talker'
import useItemReaction from '@/map/useItemReaction'
import { MAIN_STEPS } from '@/data/eventSteps'
const ABSENCE_ACTIONS = Object.freeze({
  DEFAULT: 0,
  SLEEP: 1,
  KITCHEN: 2,
  COOKIE: 3,
  SOFA: 4,
  TV: 5,
  CD: 6
})
const USING_POSITION = {
  kitchen: { x: 0, y: 20 },
  tv: { x: 0, y: 70 },
  audioSystem: { x: 0, y: 40 },
  sofa: { x: 10, y: 4 }
}
export default {
  bgm: 'happy',
  create ({ respawn = false, ep = false } = {}) {
    const bag = inject('bag')
    const event = inject('event')
    const field = inject('field').value
    const player = inject('player').value
    const talk = inject('talk').value
    const uiScene = inject('uiScene').value
    const state = inject('storage').state
    const achieve = inject('achieve')
    const audio = inject('audio')
    const getItemReaction = useItemReaction(state)

    field.charas.filter(v => v.name !== 'amili').forEach(v => {
      v.ref.value.setTargetObject(null)
      v.ref.value.setRandomWalk(100)
      v.ref.value.attackTarget = null
    })

    const getUsableItem = key => {
      return state.roomItems.filter(v => {
        return v.key === key && !field.isCollides((v.x + USING_POSITION[key].x).toTile, (v.y + USING_POSITION[key].y).toTile)
      }).random()
    }
    const absenceAction = Object.values(ABSENCE_ACTIONS).filter(v => {
      if (v === state.lastAbsenceAction) return false
      if ([ABSENCE_ACTIONS.KITCHEN, ABSENCE_ACTIONS.COOKIE].includes(v)) return getUsableItem('kitchen')
      if (v === ABSENCE_ACTIONS.SOFA) return getUsableItem('sofa')
      if (v === ABSENCE_ACTIONS.TV) return getUsableItem('tv')
      if (v === ABSENCE_ACTIONS.CD) return getUsableItem('audioSystem')
      return true
    }).filter((v, _, list) => list.length <= 3 || v !== ABSENCE_ACTIONS.DEFAULT).random()
    state.lastAbsenceAction = absenceAction

    let greetingEvent = async () => {
      await speakAmiliScripts(t('events.home.welcomeback'))
      return true
    }
    let gave = false
    let slept = false
    const amili = field.getObjectById(7)
    amili.setCapturable(false)
    amili.setRandomWalk()
    const tAmili = new Talker(t('name.amili'), amili.object)
    const speakAmiliScripts = talk.getSpeakScripts(tAmili)

    sleep(1000).then(() => {
      const totalCharm = state.status.heart + state.status.body
      uiScene.setTutorial(totalCharm >= 2 ? 'amili' : 'home')
    })

    const consumeTissue = chance => {
      if (!Math.chance(chance)) return false
      const tissue = field.objects.find(v => v.name === 'tissue' && v.x > 610 && v.y < 300)
      if (!tissue) return false
      if (Math.chance(0.3)) {
        tissue.name = 'tissueEmpty'
        const stateTissue = state.roomItems.find(v => v.key === 'tissue' && v.x === tissue.x && v.y === tissue.y)
        stateTissue.key = 'tissueEmpty'
        achieve.activate('tissue')
      }
      const { x, y } = [field.positions.trash1, field.positions.trash2, field.positions.trash3].random()
      field.addObject({ name: 'trash', x: Math.randomInt(x - 10, x + 10), y: Math.randomInt(y - 10, y + 10) })
      return true
    }

    const appleEvent = async () => {
      const options = t('events.home.giveApple')
      if (state.events.main === MAIN_STEPS.DEAD) options.splice(1, 0, t('events.home.followMe'))
      const result = await uiScene.setSelector(options)
      if (result === (options.length - 1)) return
      if (result === 1) {
        state.amiliFollowing = true
        await speakAmiliScripts(t('events.home.letsGo'))
        amili.setTapEvent(null)
        amili.setTargetObject(player.object)
        return
      }
      if (!bag.hasItem('apple')) return await speakAmiliScripts(t('events.home.noApple'))
      bag.removeItem('apple')
      await speakAmiliScripts(gave ? t('events.home.gaveApple2') : t('events.home.gaveApple1'))
      const hangout = await uiScene.setSelector(t('events.home.reward')) === 0
      if (slept && !hangout) await speakAmiliScripts(t('events.home.sleepTwice'))
      gave = true
      if (!hangout) slept = true
      const execAction = opening => {
        state.status[hangout ? 'heart' : 'body'] += 1
        const position = field.positions[hangout ? 'entrance' : 'bed']
        field.player.lookTo(hangout ? 'up' : 'rightDown')
        field.player.object.setPosition(position.x, position.y)
        amili.object.setPosition(position.x + 20, position.y)
        amili.lookTo(hangout ? 'up' : 'leftDown')
        if (!opening) audio.se('effect')
        uiScene.log.push(hangout ? t('events.home.lvup.heart') : t('events.home.lvup.body'))
        if ([1, 3, 10].includes(state.status.heart + state.status.body)) {
          uiScene.log.push(t('events.home.lvup.newArea'))
        }
        if (!hangout) consumeTissue(1)
      }
      if ((state.status.heart + state.status.body) === 0) {
        await sleep(1000)
        sleep(2500).then(() => execAction(true))
        await uiScene.startOpening()
      } else {
        const completeTransition = await uiScene.transition(700)
        execAction(false)
        await completeTransition()
      }
    }
    const itemReaction = async () => {
      const scripts = getItemReaction()
      if (!scripts) return false
      await speakAmiliScripts(scripts)
      return true
    }
    const requestApple = async () => {
      const totalCharm = state.status.heart + state.status.body
      if (totalCharm === 0) return
      if (Math.chance(totalCharm >= 10 ? 0.3 : 0.15)) return await speakAmiliScripts(t('events.home.iloveyou'))
      if (totalCharm >= 13) return
      if (state.events.main === MAIN_STEPS.DEAD) return
      if (bag.hasItem('apple')) return
      await speakAmiliScripts(t(Math.chance(0.5) ? 'events.home.requestApple.a' : 'events.home.requestApple.b'))
    }
    amili.setTapEvent(async () => {
      const canContinue = greetingEvent ? await greetingEvent() : true
      greetingEvent = null
      if (!canContinue) return
      const itemEvent = await itemReaction()
      if (!itemEvent) {
        await requestApple()
        await appleEvent()
      }
    })

    if (state.amiliFollowing) {
      greetingEvent = async () => {
        await speakAmiliScripts(t('events.home.finishFollowing'))
        return false
      }
      state.amiliFollowing = false
      const position = field.positions.entrance
      field.player.lookTo('up')
      field.player.object.setPosition(position.x, position.y)
      amili.object.setPosition(position.x + 20, position.y)
      amili.lookTo('up')
    } else if (ep) {
      greetingEvent = async () => {
        await speakAmiliScripts(t('events.home.goodmorning'))
        return false
      }
      field.player.object.setPosition(field.positions.bed.x, field.positions.bed.y)
      amili.object.setPosition(field.positions.bed.x + 20, field.positions.bed.y)
      field.player.lookTo('rightDown')
      amili.lookTo('leftDown')
    } else if (respawn) {
      field.player.object.setPosition(field.positions.bed.x, field.positions.bed.y)
      amili.object.setPosition(field.positions.bed.x + 20, field.positions.bed.y)
      event.exec(async () => {
        field.player.lookTo('rightDown')
        amili.lookTo('leftDown')
        await sleep(2000)
        await speakAmiliScripts(t('events.gameOver.amili1'))
        await sleep(1200)
        await speakAmiliScripts(t('events.gameOver.amili2'))
        await sleep(500)
        await Number(3).toArray().reduce(v => {
          return v.then(() => {
            amili.object.setPosition(amili.object.x - 1, amili.object.y)
            return sleep(50)
          })
        }, Promise.resolve())
        await sleep(500)
      })
      greetingEvent = null
    } else if (absenceAction === ABSENCE_ACTIONS.DEFAULT) {
      // Nothing to do
    } else if (absenceAction === ABSENCE_ACTIONS.SLEEP) {
      amili.object.setPosition(field.positions.bed.x + 20, field.positions.bed.y)
      amili.lookTo('rightUp')
      const consumed = state.events.itemReactions.includes('tissue') && consumeTissue(0.3)
      greetingEvent = async () => {
        await speakAmiliScripts(consumed ? t('events.home.sleeping2') : t('events.home.sleeping1'))
        return false
      }
    } else if (absenceAction === ABSENCE_ACTIONS.KITCHEN) {
      const kitchen = getUsableItem('kitchen')
      amili.object.setPosition(kitchen.x + USING_POSITION.kitchen.x, kitchen.y + USING_POSITION.kitchen.y)
      amili.lookTo('up')
      const unagi = field.objects.find(v => v.name === 'unagi')
      if (unagi) field.objects.delete(unagi)
      greetingEvent = async () => {
        await speakAmiliScripts(t('events.home.cooking'))
        const { tableBegin, tableEnd } = field.positions
        const tablemat = state.roomItems.filter(v => ['tablemat1', 'tablemat2'].includes(v.key)).filter(v => {
          return v.x > tableBegin.x && v.x < tableEnd.x && v.y > tableBegin.y && v.y < tableEnd.y
        }).random()
        const name = unagi ? 'unadon' : ['curry', 'steak', 'stirFry', 'omurice'].random()
        const pos = tablemat ?? field.positions.dish
        field.addObject({ name, x: pos.x, y: pos.y - 2 })
        return false
      }
    } else if (absenceAction === ABSENCE_ACTIONS.COOKIE) {
      amili.setTargetObject(player.object)
      greetingEvent = async () => {
        const key = ['cookies', 'lunchbox'].random()
        await speakAmiliScripts(key === 'cookies' ? t('events.home.cookie') : t('events.home.lunchbox'))
        await field.dropItem(key, amili.object)
        amili.setTargetObject(null)
        return false
      }
    } else if (absenceAction === ABSENCE_ACTIONS.SOFA) {
      const sofa = getUsableItem('sofa')
      amili.object.setPosition(sofa.x + USING_POSITION.sofa.x, sofa.y + USING_POSITION.sofa.y)
    } else if (absenceAction === ABSENCE_ACTIONS.TV) {
      const tv = getUsableItem('tv')
      amili.object.setPosition(tv.x + USING_POSITION.tv.x, tv.y + USING_POSITION.tv.y)
      amili.lookTo('up')
    } else if (absenceAction === ABSENCE_ACTIONS.CD) {
      const audioSystem = getUsableItem('audioSystem')
      amili.object.setPosition(audioSystem.x + USING_POSITION.audioSystem.x, audioSystem.y + USING_POSITION.audioSystem.y)
      amili.lookTo('up')
    }
  }
}

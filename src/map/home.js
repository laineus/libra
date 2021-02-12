import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  bgm: null,
  create ({ respawn }) {
    const bag = inject('bag')
    const event = inject('event')
    const field = inject('field').value
    const talk = inject('talk').value
    const uiScene = inject('uiScene').value
    const state = inject('storage').state

    let talked = false
    const amili = field.getObjectById(7)
    amili.setCapturable(false)
    const tAmili = new Talker(t('name.amili'), amili.object)
    const speakAmiliScripts = talk.getSpeakScripts(tAmili)

    if (respawn) {
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
    }

    const appleEvent = async () => {
      const result = await uiScene.setSelector(t('events.home.giveApple'))
      if (result === 1) return
      if (!bag.hasItem('apple')) return await speakAmiliScripts(t('events.home.noApple'))
      bag.removeItem('apple')
      await speakAmiliScripts(t('events.home.gaveApple'))
      const hangout = await uiScene.setSelector(t('events.home.reward')) === 0
      const completeTransition = await uiScene.transition(700)
      state.status[hangout ? 'heart' : 'body'] += 1
      const position = field.positions[hangout ? 'entrance' : 'bed']
      field.player.lookTo(hangout ? 'up' : 'rightDown')
      field.player.object.setPosition(position.x, position.y)
      amili.object.setPosition(position.x + 20, position.y)
      amili.lookTo(hangout ? 'up' : 'leftDown')
      uiScene.log.push(hangout ? '心の魅力が上がった' : '体の魅力が上がった')
      await completeTransition()
    }
    const itemReaction = async () => {
      const keys = Object.keys(t('events.itemReactions'))
      const doneList = state.events.itemReactions
      const name = field.objects.map(v => v.name).find(name => !doneList.includes(name) && keys.includes(name))
      if (!name) return false
      await speakAmiliScripts(t(`events.itemReactions.${name}`))
      talked = true
      return true
    }
    const requestApple = async () => {
      await speakAmiliScripts(t(Math.chance(0.5) ? 'events.home.requestApple.a' : 'events.home.requestApple.b'))
    }
    amili.setTapEvent(async () => {
      if (!talked) {
        await itemReaction() ||
        await speakAmiliScripts(t('events.home.welcomeback'))
        talked = true
      } else {
        await requestApple()
      }
      await appleEvent()
    })
  }
}

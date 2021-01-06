import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: t('events.places.home'),
  bgm: null,
  create () {
    const bag = inject('bag')
    const field = inject('field').value
    const talk = inject('talk').value
    const uiScene = inject('uiScene').value
    const state = inject('storage').state

    let talked = false
    const positions = field.objects.filter(v => v.type === 'Position').toObject(v => [v.name, { x: v.x, y: v.y }])
    const amili = field.getObjectById(7)
    amili.setCapturable(false)
    const tAmili = new Talker(t('events.name.amili'), amili.object)
    const speakAmiliScripts = talk.getSpeakScripts(tAmili)
    const appleEvent = async () => {
      const result = await uiScene.setSelector(t('events.home.giveApple'))
      if (result === 1) return
      if (!bag.hasItem('apple')) return await speakAmiliScripts('events.home.noApple')
      bag.removeItem('apple')
      await speakAmiliScripts('events.home.gaveApple')
      const hangout = await uiScene.setSelector(t('events.home.reward')) === 0
      await uiScene.transition(700)
      state.status[hangout ? 'heart' : 'body'] += 1
      const position = positions[hangout ? 'entrance' : 'bed']
      field.player.lookTo(hangout ? 'up' : 'rightDown')
      field.player.object.setPosition(position.x, position.y)
      amili.object.setPosition(position.x + 20, position.y)
      amili.lookTo(hangout ? 'up' : 'leftDown')
      uiScene.log.push(hangout ? '心の魅力が上がった' : '体の魅力が上がった')
    }
    const requestApple = async () => {
      await speakAmiliScripts(Math.chance(0.5) ? 'events.home.requestApple.a' : 'events.home.requestApple.b')
    }
    amili.setTapEvent(async () => {
      if (!talked) {
        await speakAmiliScripts('events.home.welcomeback')
        talked = true
      } else {
        await requestApple()
      }
      await appleEvent()
    })
  }
}

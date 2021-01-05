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

    const positions = field.objects.filter(v => v.type === 'Position').toObject(v => [v.name, { x: v.x, y: v.y }])
    const amili = field.getObjectById(7)
    amili.setCapturable(false)
    const tAmili = new Talker(t('events.name.amili'), amili.object)
    const appleEvent = async () => {
      const result = await uiScene.setSelector(t('events.home.giveApple'))
      if (result === 1) return
      if (!bag.hasItem('apple')) {
        await talk.setTalk([
          { chara: tAmili, text: t('events.home.noApple') }
        ])
        return
      }
      bag.removeItem('apple')
      const gave = t('events.home.gaveApple')
      await talk.setTalk([
        { chara: tAmili, text: gave.shift() },
        { chara: tAmili, text: gave.shift() }
      ])
      const hangout = await uiScene.setSelector(t('events.home.reward')) === 0
      await uiScene.transition(700)
      state.status[hangout ? 'heart' : 'body'] += 1
      const position = positions[hangout ? 'entrance' : 'bed']
      field.player.lookTo(hangout ? 'up' : 'rightDown')
      field.player.object.setPosition(position.x, position.y)
      amili.object.setPosition(position.x + 20, position.y)
      amili.lookTo(hangout ? 'up' : 'leftDown')
    }
    const requestApple = async () => {
      const scriptA = t('events.home.requestApple.a')
      await talk.setTalk([
        { chara: tAmili, text: scriptA.shift() },
        { chara: tAmili, text: scriptA.shift() }
      ])
      const scriptB = t('events.home.requestApple.b')
      await talk.setTalk([
        { chara: tAmili, text: scriptB.shift() },
        { chara: tAmili, text: scriptB.shift() },
        { chara: tAmili, text: scriptB.shift() }
      ])
    }
    amili.setTapEvent(async () => {
      await talk.setTalk([
        { chara: tAmili, text: t('events.home.welcomeback') }
      ])
      await appleEvent()
    })
  }
}

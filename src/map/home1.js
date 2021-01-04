import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: '部屋',
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
    const tAmili = new Talker('アミリ', amili.object)
    const appleEvent = async () => {
      const result = await uiScene.setSelector(['リンゴを渡す', 'なんでもない'])
      if (result === 1) return
      if (!bag.hasItem('apple')) {
        await talk.setTalk([
          { chara: tAmili, text: 'ないじゃん' }
        ])
        return
      }
      bag.removeItem('apple')
      await talk.setTalk([
        { chara: tAmili, text: 'ありがとう！' },
        { chara: tAmili, text: '今日はどうしたい？' }
      ])
      const hangout = await uiScene.setSelector(['散歩がしたい', '一緒に寝たい']) === 0
      await uiScene.transition(700)
      state.status[hangout ? 'heart' : 'body'] += 1
      const position = positions[hangout ? 'entrance' : 'bed']
      field.player.lookTo(hangout ? 'up' : 'rightDown')
      field.player.object.setPosition(position.x, position.y)
      amili.object.setPosition(position.x + 20, position.y)
      amili.lookTo(hangout ? 'up' : 'leftDown')
    }
    amili.setTapEvent(async () => {
      await talk.setTalk([
        { chara: tAmili, text: 'おかえり、リブラ！' }
      ])
      await appleEvent()
    })
  }
}

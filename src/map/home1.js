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
      const action = await uiScene.setSelector(['散歩がしたい', '一緒に寝たい'])
      state.status[action === 0 ? 'heart' : 'body'] += 1
    }
    amili.setTapEvent(async () => {
      await talk.setTalk([
        { chara: tAmili, text: 'おかえり、リブラ！' }
      ])
      await appleEvent()
    })
  }
}

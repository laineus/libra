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
      await talk.setTalk([
        { chara: tAmili, text: 'ありがとう！' },
        { chara: tAmili, text: '今日はどうしたい？' }
      ])
    }
    amili.setTapEvent(async () => {
      await talk.setTalk([
        { chara: tAmili, text: 'おかえり、リブラ！' }
      ])
      await appleEvent()
    })
  }
}

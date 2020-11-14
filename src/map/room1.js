import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: '部屋',
  bgm: null,
  create () {
    const field = inject('field')
    const talk = inject('talk')
    const player = inject('player')
    const npc = field.value.getObjectById(16)
    const tNpc = new Talker('NPC', npc.object)
    const tPlayer = new Talker('Player', player.value.object)
    npc.setTapEvent(async () => {
      await talk.value.setTalk([
        { chara: tNpc, text: 'aaaaaaaaaaaaaaaaaaa' },
        { chara: tPlayer, text: 'bbbb' },
        { chara: tNpc, text: 'あいうえおか\nきくけこ' }
      ])
    })
  }
}

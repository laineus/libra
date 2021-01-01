import { inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: '森2',
  create () {
    const field = inject('field')
    const camera = inject('camera').value
    const talk = inject('talk')
    const { exec } = inject('event')
    const sleep = inject('sleep')
    const kajitsu = field.value.getObjectById(2)
    // const apple = field.value.getObjectById(4)
    const tKajitsu = new Talker('NPC', kajitsu.object)
    exec(async () => {
      await sleep(1000)
      const revert = await camera.move(0, -100, 2000)
      await sleep(500)
      const walk = t('events.forest2Kajitsu.walk')
      await talk.value.setTalk([
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() }
      ])
      await revert()
    })
    kajitsu.setTapEvent(async () => {
      const walk = t('events.forest2Kajitsu.walk')
      await talk.value.setTalk([
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() },
        { chara: tKajitsu, text: walk.shift() }
      ])
    })
  }
}

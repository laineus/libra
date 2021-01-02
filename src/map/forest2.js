import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
export default {
  name: '森2',
  create () {
    const storage = inject('storage')
    const field = inject('field')
    const camera = inject('camera').value
    const talk = inject('talk')
    const { exec } = inject('event')
    const sleep = inject('sleep')
    const kajitsu = field.value.getObjectById(2)
    const area = field.value.getObjectById(5)
    // const apple = field.value.getObjectById(4)
    const tKajitsu = new Talker('NPC', kajitsu.object)

    // Auto start event
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
      storage.state.events.intro = 1
    })

    // Area event
    const areaEvent = computed(() => {
      if (storage.state.events.intro !== 1) return
      return async () => {
        const talking = t('events.forest2Kajitsu.talk')
        await talk.value.setTalk([
          { chara: tKajitsu, text: talking.shift() },
          { chara: tKajitsu, text: talking.shift() },
          { chara: tKajitsu, text: talking.shift() }
        ])
        storage.state.events.intro = 2
      }
    })
    area.setEvent(areaEvent)

    // Talk Events
    const kajitsuEvent = computed(() => {
      switch (storage.state.events.intro) {
        case 0: return null
        case 1: return null
        case 2: return async () => {
          const apple = t('events.forest2Kajitsu.apple')
          await talk.value.setTalk([
            { chara: tKajitsu, text: apple.shift() },
            { chara: tKajitsu, text: apple.shift() }
          ])
          const revert = await camera.move(100, -200, 2000)
          await sleep(500)
          await talk.value.setTalk([
            { chara: tKajitsu, text: apple.shift() },
            { chara: tKajitsu, text: apple.shift() },
            { chara: tKajitsu, text: apple.shift() },
            { chara: tKajitsu, text: apple.shift() }
          ])
          await revert()
          storage.state.events.intro = 3
        }
        case 3: return async () => {
          const apple = t('events.forest2Kajitsu.apple').slice(2)
          await talk.value.setTalk([
            { chara: tKajitsu, text: apple.shift() },
            { chara: tKajitsu, text: apple.shift() },
            { chara: tKajitsu, text: apple.shift() },
            { chara: tKajitsu, text: apple.shift() }
          ])
        }
      }
    })
    kajitsu.setTapEvent(kajitsuEvent)
  }
}

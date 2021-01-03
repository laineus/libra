import { computed, inject } from 'vue'
import Talker from '@/util/Talker'
const STEPS = {
  INTRO: 0,
  WALK: 1,
  TALK: 2,
  APPLE: 3,
  COMPLETED: 4
}
export default {
  name: '森2',
  async create () {
    const storage = inject('storage')
    const uiScene = inject('uiScene')
    const field = inject('field')
    const camera = inject('camera').value
    const talk = inject('talk')
    const { exec } = inject('event')
    const sleep = inject('sleep')
    const hasApple = computed(() => storage.state.items.some(v => v.key === 'apple'))
    const gate = field.value.getObjectById(1)
    if (storage.state.events.intro < STEPS.COMPLETED) {
      gate.setEvent(async () => {
        console.log('この先へはまだ行けません')
      })
    }
    const kajitsu = field.value.getObjectById(2)
    kajitsu.setCapturable(false)
    kajitsu.setVisible(computed(() => storage.state.events.intro < STEPS.COMPLETED))
    const area = field.value.getObjectById(5)
    const apple = field.value.getObjectById(4)
    apple.setVisible(computed(() => storage.state.events.intro === STEPS.APPLE && !hasApple.value))
    if (hasApple.value) apple.destroy()
    const tKajitsu = new Talker('NPC', kajitsu.object)

    // Auto start event
    if (storage.state.events.intro === STEPS.INTRO) {
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
        storage.state.events.intro = STEPS.WALK
      })
    }

    // Area event
    const areaEvent = computed(() => {
      if (storage.state.events.intro !== STEPS.WALK) return
      return async () => {
        const talking = t('events.forest2Kajitsu.talk')
        await talk.value.setTalk([
          { chara: tKajitsu, text: talking.shift() },
          { chara: tKajitsu, text: talking.shift() },
          { chara: tKajitsu, text: talking.shift() }
        ])
        storage.state.events.intro = STEPS.TALK
      }
    })
    area.setEvent(areaEvent)

    // Talk Events
    const kajitsuEvent = computed(() => {
      if (storage.state.events.intro === STEPS.TALK) {
        return async () => {
          apple.setVisible(true)
          storage.state.events.intro = STEPS.APPLE
          const apl = t('events.forest2Kajitsu.apple')
          await talk.value.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
          const revert = await camera.move(100, -200, 2000)
          await sleep(500)
          await talk.value.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
          await revert()
        }
      } else if (storage.state.events.intro === STEPS.APPLE && !hasApple.value) {
        return async () => {
          const apl = t('events.forest2Kajitsu.apple').slice(2)
          await talk.value.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
        }
      } else if (storage.state.events.intro === STEPS.APPLE && hasApple.value) {
        return async () => {
          const completed = t('events.forest2Kajitsu.completed')
          await talk.value.setTalk([
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() }
          ])
          const onCompleted = await uiScene.value.transition(1000)
          storage.state.events.intro = STEPS.COMPLETED
          gate.restoreEvent()
          await onCompleted()
        }
      }
    })
    kajitsu.setTapEvent(kajitsuEvent)
  }
}

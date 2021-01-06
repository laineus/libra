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
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const camera = inject('camera').value
    const talk = inject('talk').value
    const { exec } = inject('event')
    const sleep = inject('sleep')
    const bag = inject('bag')

    const sumStatus = computed(() => storage.state.status.heart + storage.state.status.body)
    const gate = field.getObjectById(1)
    if (storage.state.events.intro < STEPS.COMPLETED) {
      gate.setEvent(async () => {
        console.log('この先へはまだ行けません')
      })
    }
    const kajitsu = field.getObjectById(2)
    kajitsu.setCapturable(false)
    kajitsu.setVisible(computed(() => storage.state.events.intro < STEPS.COMPLETED))
    const area = field.getObjectById(5)
    const mountApple = () => field.addObject({ type: 'Substance', name: 'apple', x: field.positions.apple.x, y: field.positions.apple.y })
    if (sumStatus.value > 0 ? Math.chance(0.01) : !bag.hasItem('apple', 1, { room: true, bag: true })) {
      mountApple()
    }

    const tKajitsu = new Talker('NPC', kajitsu.object)

    // Auto start event
    if (storage.state.events.intro === STEPS.INTRO) {
      exec(async () => {
        await sleep(1000)
        const revert = await camera.move(0, -100, 2000)
        await sleep(500)
        const walk = t('events.forest2Kajitsu.walk')
        await talk.setTalk([
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
        await talk.setTalk([
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
          mountApple()
          storage.state.events.intro = STEPS.APPLE
          const apl = t('events.forest2Kajitsu.apple')
          await talk.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
          const revert = await camera.move(100, -200, 2000)
          await sleep(500)
          await talk.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
          await revert()
        }
      } else if (storage.state.events.intro === STEPS.APPLE && !bag.hasItem('apple')) {
        return async () => {
          const apl = t('events.forest2Kajitsu.apple').slice(2)
          await talk.setTalk([
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() },
            { chara: tKajitsu, text: apl.shift() }
          ])
        }
      } else if (storage.state.events.intro === STEPS.APPLE) {
        return async () => {
          const completed = t('events.forest2Kajitsu.completed')
          await talk.setTalk([
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() },
            { chara: tKajitsu, text: completed.shift() }
          ])
          const onCompleted = await uiScene.transition(1000)
          storage.state.events.intro = STEPS.COMPLETED
          gate.restoreEvent()
          await onCompleted()
        }
      }
    })
    kajitsu.setTapEvent(kajitsuEvent)
  }
}

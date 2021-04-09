import { inject } from 'vue'
import Talker from '@/util/Talker'
import { BOGUS_STEPS } from '@/data/eventSteps'
import { initHospitalButton, lockInHospital } from '@/map/hospitalFunctions'
import config from '@/data/config'
export default {
  bgm: null,
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const player = inject('player').value
    initHospitalButton(field.getObjectById(89))
    lockInHospital()

    const hands = Array.range(96, 101).map(id => field.objects.find(v => v.id === id))
    hands.forEach(v => field.delObject(v))
    if (state.events.bogusDoctor === BOGUS_STEPS.STARTED) {
      player.speed = 100
      const handArea = field.getObjectById(102)
      handArea.setEvent(async () => {
        hands.reduce((prev, hand) => {
          return prev.then(() => {
            field.objects.push(hand)
            return sleep(300)
          })
        }, Promise.resolve()).then(() => {
          hands.forEach(v => field.delObject(v))
          const img = { texture: 'face', x: config.WIDTH.half, y: config.HEIGHT.half, depth: config.DEPTH.TRANSITION }
          uiScene.images.push(img)
          sleep(800).then(() => uiScene.images.delete(img))
        })
        handArea.setEvent(null)
      })
    }

    const list = [
      { chara: field.getObjectById(90), script: t('events.bogusDoctor.patient1'), talked: false },
      { chara: field.getObjectById(91), script: t('events.bogusDoctor.patient2'), talked: false },
      { chara: field.getObjectById(92), script: t('events.bogusDoctor.patient3'), talked: false },
      { chara: field.getObjectById(93), script: t('events.bogusDoctor.patient4'), talked: false }
    ]
    const ghost5 = field.getObjectById(3)
    ghost5.setVisible(false)
    if (state.events.bogusDoctor !== BOGUS_STEPS.STARTED) {
      list.forEach(v => v.chara.setVisible(false))
    } else {
      field.objects.filter(v => v.type === 'Character' && !v.unique).forEach(v => v.ref.value.setVisible(false))
      list.forEach(v => {
        v.chara?.setTapEvent(async () => {
          const speak = talk.getSpeakScripts(new Talker(t('name.patient'), v.chara.object))
          await speak(v.script)
          v.talked = true
          if (list.every(v => v.talked)) ghost5.setVisible(true)
        })
      })
      ghost5?.setTapEvent(async () => {
        const speak = talk.getSpeakScripts(new Talker(t('name.patient'), ghost5.object))
        await speak(t('events.bogusDoctor.patient5'))
        state.events.bogusDoctor = BOGUS_STEPS.SOLVED
      })
    }

    const amili = field.getObjectById(94)
    amili.setVisible(state.events.bogusDoctor === BOGUS_STEPS.STARTED)
    amili.setRandomWalk(false)
    amili.setTapEvent(async () => {
      amili.substance.hp = 0
      await sleep(500)
    }, { focus: false, look: false })
  }
}

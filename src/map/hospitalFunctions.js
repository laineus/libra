
import { inject } from 'vue'
import { BOGUS_STEPS } from '@/data/eventSteps'
const NIGHT = 'night'
export const initHospitalButton = button => {
  const gameScene = inject('gameScene').value
  const uiScene = inject('uiScene').value
  const state = inject('storage').state
  button?.setTapEvent(async () => {
    if (state.events.bogusDoctor < BOGUS_STEPS.SOLVED) {
      uiScene.log.push(t('ui.nothingHappened'))
    } else if (state.events.bogusDoctor === BOGUS_STEPS.SOLVED) {
      gameScene.setField('hospital2', 1090, 385, 'up', { transition: 0 })
      await sleep(100)
    } else {
      const mapName = state.map.endsWith(NIGHT) ? state.map.replace(NIGHT, '') : `${state.map}${NIGHT}`
      gameScene.setField(mapName, state.x, state.y, state.r, { transition: 0 })
      await sleep(100)
    }
  })
}

export const hideChara = () => {
  const state = inject('storage').state
  if (state.events.bogusDoctor !== BOGUS_STEPS.STARTED) return
  const field = inject('field').value
  field.objects.filter(v => v.type === 'Character' && !v.unique).forEach(v => v.ref.value.setVisible(false))
}

export const lockInHospital = () => {
  const gameScene = inject('gameScene').value
  const state = inject('storage').state
  const player = inject('player').value
  if (state.events.bogusDoctor === BOGUS_STEPS.STARTED) {
    player.substance.setDamageEvent((v) => {
      if ((player.substance.hp - v) <= 0) {
        player.substance.hp = 100 + v
        gameScene.setField('hospital2night', (5).toPixelCenter, (24).toPixelCenter, 'up')
      }
    })
  }
}

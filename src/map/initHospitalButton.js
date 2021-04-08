import { inject } from 'vue'
import { BOGUS_STEPS } from '@/data/eventSteps'
const NIGHT = 'night'
export default button => {
  const gameScene = inject('gameScene').value
  const uiScene = inject('uiScene').value
  const state = inject('storage').state
  button?.setTapEvent(async () => {
    l(state.events.bogusDoctor, BOGUS_STEPS.SOLVED)
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

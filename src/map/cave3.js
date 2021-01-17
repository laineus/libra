import { inject } from 'vue'
import Talker from '@/util/Talker'
const STEPS = {
  NULL: 0,
  STARTED: 1,
  TALKED_TORRENT: 2,
  EXECUTED: 3,
  NOTICED_DID: 4,
  END: 9
}
export default {
  name: '洞窟3',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const leftBat = field.getObjectById(3)
    const rightBat = field.getObjectById(4)

    const timeEstimated = state.events.curse === STEPS.NOTICED_DID
  }
}

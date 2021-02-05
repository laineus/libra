import { inject } from 'vue'
import Talker from '@/util/Talker'
import { SNAKE_FLOG_STEPS } from '@/data/eventSteps'
export default {
  name: '洞窟1',
  async create () {
    const uiScene = inject('uiScene').value
    const field = inject('field').value
    const talk = inject('talk').value
    const state = inject('storage').state
    const bag = inject('bag')

    const snake = field.getObjectById(5)
    snake?.setTapEvent(async () => {
      const speakSnake = talk.getSpeakScripts(new Talker('コウモリ', snake.object))
      if (state.events.snakeFlog === SNAKE_FLOG_STEPS.NULL) {
        await speakSnake(t('events.snakeFlog.start'))
        state.events.snakeFlog = SNAKE_FLOG_STEPS.STARTED
      } else if (state.events.snakeFlog === SNAKE_FLOG_STEPS.STARTED) {
        if (bag.hasItem('sapphire', 2) && bag.hasItem('emerald', 2) && bag.hasItem('amethyst', 2) && bag.hasItem('ruby', 2)) {
          const give = await uiScene.setSelector(t('events.snakeFlog.options')) === 0
          if (give) {
            bag.removeItem('sapphire', 2)
            bag.removeItem('emerald', 2)
            bag.removeItem('amethyst', 2)
            bag.removeItem('ruby', 2)
            await speakSnake(t('events.snakeFlog.complete1'))
            uiScene.log.push(...t('events.snakeFlog.logs'))
            await speakSnake(t('events.snakeFlog.complete2'))
            field.dropItem('apple', snake.object)
            state.events.snakeFlog = SNAKE_FLOG_STEPS.COMPLETED
          }
          return
        }
        return await speakSnake(t('events.snakeFlog.started'))
      } else if (state.events.snakeFlog === SNAKE_FLOG_STEPS.COMPLETED) {
        await speakSnake(t('events.snakeFlog.completed'))
      }
    })
  }
}

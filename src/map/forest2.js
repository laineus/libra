import { inject } from 'vue'
export default {
  name: '森2',
  create () {
    const field = inject('field')
    const kajitsu = field.value.getObjectById(2)
    const apple = field.value.getObjectById(4)
    console.log(t('events.forest2Kajitsu.walk'))
  }
}

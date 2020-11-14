import { inject } from 'vue'
export default {
  name: '街',
  bgm: 'town',
  create () {
    const field = inject('field')
    const gameScene = inject('gameScene')
    const substance = field.value.getObjectById(6)
    substance.setTapEvent(() => gameScene.value.setField('room1', (17).toPixel, (17).toPixel))
  }
}

import { inject } from 'vue'
import initHospitalButton from './initHospitalButton'
export default {
  bgm: 'libra',
  async create () {
    const field = inject('field').value
    initHospitalButton(field.getObjectById(29))
  }
}

import { inject } from 'vue'
export default {
  name: '森2',
  async create () {
    const field = inject('field').value
    const torrent = field.getObjectById(3)
    const flog = field.getObjectById(4)
    console.log(torrent, flog)
  }
}

import { ref } from 'vue'

export default () => {
  let tmp = null
  let distance = Infinity
  const value = ref(null)
  const store = substance => {
    if (substance.distanceToPlayer > distance) return
    tmp = substance
    distance = substance.distanceToPlayer
  }
  const commit = () => {
    value.value = tmp
    tmp = null
    distance = Infinity
  }
  return {
    value,
    store,
    commit
  }
}

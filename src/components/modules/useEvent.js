import { inject, ref } from 'vue'
export default () => {
  const eventManager = inject('event')
  const player = inject('player')
  const event = ref(null)
  const setEvent = e => {
    event.value = e
  }
  const exec = () => {
    if (!event.value) return
    return eventManager.exec(event.value).then(result => {
      player.value?.clearTargetPosition()
      return result
    })
  }
  return { event, setEvent, exec }
}

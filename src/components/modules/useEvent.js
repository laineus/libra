import { inject, ref } from 'vue'
export default () => {
  const eventManager = inject('event')
  const event = ref(null)
  const setEvent = e => {
    event.value = e
  }
  const exec = () => {
    if (!event.value) return
    return eventManager.exec(event.value)
  }
  return { event, setEvent, exec }
}

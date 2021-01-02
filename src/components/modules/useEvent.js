import { inject, ref, unref, computed } from 'vue'
export default () => {
  const eventManager = inject('event')
  const _event = ref(null)
  const event = computed(() => unref(_event.value)) // Allow to use computed for event value
  const setEvent = e => {
    _event.value = e
  }
  const exec = () => {
    if (!event.value) return
    return eventManager.exec(event.value)
  }
  return { event, setEvent, exec }
}

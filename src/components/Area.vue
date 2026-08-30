<template>
  <Zone ref="object" :active="false" :origin="0" />
</template>

<script>
import { inject, onMounted, computed } from 'vue'
import { onPreUpdate, refPhaserInstance, useScene, Zone } from 'phavuer'
import useEvent from './modules/useEvent'
const NEW_ENTER_DELAY = 10 * (1000 / 60)
export default {
  components: { Zone },
  setup () {
    const scene = useScene()
    const event = inject('event')
    const player = inject('player')
    const object = refPhaserInstance(null)
    const areaEvent = useEvent()
    let elapsed = 0
    let lastEnteredAt = elapsed
    const active = computed(() => areaEvent.event.value && !event.state)
    const onEnter = () => {
      const newEntered = lastEnteredAt < (elapsed - NEW_ENTER_DELAY)
      lastEnteredAt = elapsed
      if (active.value && newEntered) {
        areaEvent.exec()
      }
    }
    onPreUpdate((time, delta) => {
      elapsed += delta
    })
    onMounted(() => {
      scene.physics.world.enable(object.value)
      scene.physics.add.overlap(object.value, player.value.object, onEnter)
    })
    return {
      object,
      active,
      setEvent: areaEvent.setEvent
    }
  }
}
</script>

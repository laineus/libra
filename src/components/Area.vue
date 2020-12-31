<template>
  <Zone ref="object" :active="false" :origin="0" />
</template>

<script>
import { inject, onMounted, computed } from 'vue'
import { refObj, Zone } from 'phavuer'
import useEvent from './modules/useEvent'
const FRAMES_FOR_NEW_ENTER = 10
export default {
  components: { Zone },
  setup () {
    const scene = inject('scene')
    const frames = inject('frames')
    const event = inject('event')
    const player = inject('player')
    const object = refObj(null)
    const areaEvent = useEvent()
    let lastEnteredFrame = frames.game
    const active = computed(() => areaEvent.event.value && !event.state)
    const onEnter = () => {
      const newEntered = lastEnteredFrame < (frames.game - FRAMES_FOR_NEW_ENTER)
      lastEnteredFrame = frames.game
      if (active.value && newEntered) {
        player.value.object.body.velocity.normalize().scale(70)
        areaEvent.exec()
      }
    }
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

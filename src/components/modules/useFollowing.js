import { computed, ref, reactive, unref } from 'vue'
import useRandomWalk from '@/components/modules/useRandomWalk'

export default chara => {
  const targetPosition = reactive({
    x: null,
    y: null
  })
  let randomWalk = null
  const targetObject = ref(null)
  const leaveFromTargetObject = ref(false)
  const setTargetObject = (object, leave = false) => {
    targetObject.value = object
    leaveFromTargetObject.value = leave
  }
  let resolver = null
  const setTargetPosition = (x, y) => {
    targetPosition.x = x
    targetPosition.y = y
    return new Promise(resolve => {
      resolver = resolve
    })
  }
  const clearTargetPosition = () => {
    targetPosition.x = null
    targetPosition.y = null
    if (resolver) resolver()
  }
  const setRandomWalk = distance => {
    if (!distance) return randomWalk = null
    randomWalk = useRandomWalk(chara, distance)
  }
  const hasTargetPosition = computed(() => targetPosition.x !== null && targetPosition.y !== null)
  const getDiffToTargetPositionX = () => hasTargetPosition.value ? targetPosition.x - unref(chara).x : 0
  const getDiffToTargetPositionY = () => hasTargetPosition.value ? targetPosition.y - unref(chara).y : 0
  const walkToTargetPosition = speed => {
    if (randomWalk) randomWalk.play(pos => setTargetPosition(pos.x, pos.y)) // Cannot read property 'x' of null
    if (targetObject.value) setTargetPosition(targetObject.value.x, targetObject.value.y)
    if (!hasTargetPosition.value) return
    const diffX = getDiffToTargetPositionX()
    const diffY = getDiffToTargetPositionY()
    const distance = Math.hypot(diffX, diffY)
    if (targetObject.value) {
      if (!leaveFromTargetObject.value && (distance < 50 || distance > 200)) return clearTargetPosition()
      if (leaveFromTargetObject.value && distance > 160) return clearTargetPosition()
    }
    const body = unref(chara).body
    const x = (!body.blocked.left && !body.blocked.right) ? diffX : diffX * 0.1
    const y = (!body.blocked.top && !body.blocked.down) ? diffY : diffY * 0.1
    leaveFromTargetObject.value ? body.setVelocity(-x, -y) : body.setVelocity(x, y)
    const spd = Math.min(speed, distance * 10)
    body.velocity.normalize().scale(spd)
    if (distance < 5) clearTargetPosition()
  }
  return {
    targetPosition,
    setTargetPosition,
    clearTargetPosition,
    setRandomWalk,
    hasTargetPosition,
    getDiffToTargetPositionX,
    getDiffToTargetPositionY,
    walkToTargetPosition,
    targetObject,
    setTargetObject
  }
}

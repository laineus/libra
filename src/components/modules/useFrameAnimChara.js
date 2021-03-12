import useFrameAnim from '@/components/modules/useFrameAnim'
import { reactive, unref } from 'vue'
const WALK_ANIM = [
  { key: 'down', frames: [1, 0, 1, 2], duration: 10 },
  { key: 'left', frames: [4, 3, 4, 5], duration: 10 },
  { key: 'right', frames: [7, 6, 7, 8], duration: 10 },
  { key: 'up', frames: [10, 9, 10, 11], duration: 10 },
  { key: 'leftDown', frames: [13, 12, 13, 14], duration: 10 },
  { key: 'rightDown', frames: [16, 15, 16, 17], duration: 10 },
  { key: 'leftUp', frames: [19, 18, 19, 20], duration: 10 },
  { key: 'rightUp', frames: [22, 21, 22, 23], duration: 10 }
]
const baseFrames = WALK_ANIM.reduce((result, v) => {
  result[v.key] = v.frames[0]
  return result
}, {})
const getVelocityToDirectionKey = numOfDirection => r => {
  if (numOfDirection === 4) {
    const step = Math.PI / 2
    switch (Math.round(r / step)) {
      case 2: return 'left'
      case 1: return 'down'
      case 0: return 'right'
      case -1: return 'up'
      case -2: return 'left'
    }
  } else if (numOfDirection === 8) {
    const step = Math.PI / 4
    switch (Math.round(r / step)) {
      case 4: return 'left'
      case 3: return 'leftDown'
      case 2: return 'down'
      case 1: return 'rightDown'
      case 0: return 'right'
      case -1: return 'rightUp'
      case -2: return 'up'
      case -3: return 'leftUp'
      case -4: return 'left'
    }
  }
}
const rForKey = {
  left: Math.PI,
  leftDown: Math.PI * 0.75,
  down: Math.PI * 0.5,
  rightDown: Math.PI * 0.25,
  right: 0,
  rightUp: Math.PI * -0.25,
  up: Math.PI * -0.5,
  leftUp: Math.PI * -0.75
}
export default (object, initR, numOfDirection, standingAnim = false) => {
  const velocityToDirectionKey = getVelocityToDirectionKey(numOfDirection)
  const frameAnim = useFrameAnim(WALK_ANIM)
  const state = reactive({
    r: initR,
    directionKey: velocityToDirectionKey(initR)
  })
  const play = () => {
    const walking = Math.hypot(unref(object).body.velocity.x, unref(object).body.velocity.y) > 1
    if (walking) {
      state.r = Math.atan2(unref(object).body.velocity.y, unref(object).body.velocity.x)
      state.directionKey = velocityToDirectionKey(state.r)
      return frameAnim.play(state.directionKey)
    } else if (standingAnim) {
      return frameAnim.play(state.directionKey)
    }
    return baseFrames[state.directionKey]
  }
  const lookTo = to => {
    const getDirectionKey = to => {
      switch (typeof to) {
        case 'string': return to
        case 'number': return velocityToDirectionKey(to)
        case 'object': return velocityToDirectionKey(Math.atan2(to.y - unref(object).y, to.x - unref(object).x))
      }
    }
    state.directionKey = getDirectionKey(to)
    state.r = typeof to === 'number' ? to : rForKey[state.directionKey]
  }
  return {
    state,
    play,
    lookTo
  }
}

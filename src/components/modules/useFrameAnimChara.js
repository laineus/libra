import useFrameAnim from '@/components/modules/useFrameAnim'
import { inject, unref } from 'vue'
const WALK_ANIM = [
  { key: 'down', frames: [1, 0, 1, 2], duration: 7 },
  { key: 'left', frames: [4, 3, 4, 5], duration: 7 },
  { key: 'right', frames: [7, 6, 7, 8], duration: 7 },
  { key: 'up', frames: [10, 9, 10, 11], duration: 7 }
]
const BASE_FRAME = { down: 1, left: 4, right: 7, up: 10 }
const velocityToDirectionKey = (x, y) => {
  if (Math.round(Math.abs(x)) > Math.round(Math.abs(y))) return x < 0 ? 'left' : 'right'
  return y < 0 ? 'up' : 'down'
}
export default (object, image, initR) => {
  const event = inject('event')
  const frameAnim = useFrameAnim(WALK_ANIM, image)
  let directionKey = velocityToDirectionKey(Math.cos(initR), Math.sin(initR))
  const play = () => {
    if (event.state) {
      unref(image).setFrame(BASE_FRAME[directionKey])
      return
    }
    const walking = Math.hypot(unref(object).body.velocity.x, unref(object).body.velocity.y) > 1
    if (walking) {
      directionKey = velocityToDirectionKey(unref(object).body.velocity.x, unref(object).body.velocity.y)
      frameAnim.play(directionKey)
    } else {
      unref(image).setFrame(BASE_FRAME[directionKey]) // Set last frame
    }
  }
  const lookAt = (x, y) => {
    directionKey = velocityToDirectionKey(x - unref(object).x, y - unref(object).y)
  }
  return {
    play,
    lookAt
  }
}

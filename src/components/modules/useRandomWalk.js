import { ref, unref } from 'vue'
export default (field, chara, range) => {
  const radius = Math.round(range / 2)
  const delay = ref(0)
  const setNextDelay = () => {
    delay.value = Math.randomInt(100, 200)
  }
  setNextDelay()
  const getRandomPosition = (tryCount = 10) => {
    if (tryCount === 0) return null
    const x = unref(chara).x + Math.randomInt(-radius, radius)
    const y = unref(chara).y + Math.randomInt(-radius, radius)
    const collides = field.isCollides(x.toTile, y.toTile)
    return collides ? getRandomPosition(tryCount - 1) : { x, y }
  }
  const play = callback => {
    delay.value--
    if (delay.value > 0) return
    setNextDelay()
    const pos = getRandomPosition()
    return pos ? callback(pos) : false
  }
  return { play }
}

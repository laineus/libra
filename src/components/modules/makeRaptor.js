const MAP = {
  raptor1: { minX: 20, minY: -30, maxX: 40, maxY: -5 }, // head
  raptor4: { minX: -10, minY: -40, maxX: 40, maxY: -7 }, // left arm
  raptor3: { minX: 10, minY: -10, maxX: 35, maxY: 15 }, // right arm
  raptor6: { minX: -35, minY: 8, maxX: 23, maxY: 30 }, // leftLeg
  raptor5: { minX: 5, minY: 18, maxX: 23, maxY: 34 }, // rightLeg
  raptor7: { minX: -48, minY: 0, maxX: -30, maxY: 15 } // tail
}
export default items => {
  const completedParts = items.filter(v => v.key === 'raptor2').map(body => {
    const validParts = Object.entries(MAP).map(([key, v]) => {
      return items.find(item => {
        if (item.key !== key) return false
        const diffX = item.bagX - body.bagX
        const diffY = item.bagY - body.bagY
        return diffX >= v.minX && diffX <= v.maxX && diffY >= v.minY && diffY <= v.maxY
      })
    }).filter(Boolean)
    return validParts.length === Object.keys(MAP).length ? [body, ...validParts] : false
  }).find(Boolean)
  if (!completedParts) return
  completedParts.forEach(v => items.delete(v))
  items.push({
    id: Math.randomInt(1000000, 9999999),
    key: 'raptor',
    scale: 1,
    bagX: completedParts[0].bagX,
    bagY: completedParts[0].bagY
  })
}

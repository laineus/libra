const MAP = {
  raptor1: { minX: 15, maxX: 45, minY: -35, maxY: 0 }, // head
  raptor4: { minX: -15, maxX: 45, minY: -45, maxY: -2 }, // left arm
  raptor3: { minX: 5, maxX: 40, minY: -15, maxY: 20 }, // right arm
  raptor6: { minX: -40, maxX: 28, minY: 3, maxY: 35 }, // leftLeg
  raptor5: { minX: 0, maxX: 28, minY: 13, maxY: 39 }, // rightLeg
  raptor7: { minX: -53, maxX: -25, minY: -5, maxY: 20 } // tail
}
export default (isField, { state, uiScene, field, achieve, audio }) => {
  const items = isField ? field.objects : state.bagItems
  const keyX = isField ? 'x' : 'bagX'
  const keyY = isField ? 'y' : 'bagY'
  const keyName = isField ? 'name' : 'key'
  const completedParts = items.filter(v => v[keyName] === 'raptor2').map(body => {
    const baseX = isField ? (body.ref.value?.object.x ?? body.x) : body.bagX
    const baseY = isField ? (body.ref.value?.object.y ?? body.y) : body.bagY
    const getDiff = tgt => {
      const tgtX = isField ? (tgt.ref.value?.object.x ?? tgt.x) : tgt.bagX
      const tgtY = isField ? (tgt.ref.value?.object.y ?? tgt.y) : tgt.bagY
      return [tgtX - baseX, tgtY - baseY]
    }
    const validParts = Object.entries(MAP).map(([key, v]) => {
      return items.find(item => {
        if (item[keyName] !== key) return false
        const [diffX, diffY] = getDiff(item)
        return diffX >= v.minX && diffX <= v.maxX && diffY >= v.minY && diffY <= v.maxY
      })
    }).filter(Boolean)
    return validParts.length === Object.keys(MAP).length ? [body, ...validParts] : false
  }).find(Boolean)
  if (!completedParts) return false
  completedParts.forEach(v => items.delete(v))
  const raptor = {
    id: Math.randomInt(1000000, 9999999),
    [keyName]: 'raptor',
    scale: 1,
    [keyX]: completedParts[0][keyX],
    [keyY]: completedParts[0][keyY]
  }
  if (isField) {
    field.addObject(raptor)
  } else {
    items.push(raptor)
  }
  uiScene.log.push(t('ui.raptor'))
  achieve.activate('raptor')
  audio.se('drop')
  return true
}

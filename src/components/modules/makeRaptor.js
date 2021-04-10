const MAP = {
  raptor1: { minX: 20, minY: -30, maxX: 40, maxY: -5 }, // head
  raptor4: { minX: -10, minY: -40, maxX: 40, maxY: -7 }, // left arm
  raptor3: { minX: 10, minY: -10, maxX: 35, maxY: 15 }, // right arm
  raptor6: { minX: -35, minY: 8, maxX: 23, maxY: 30 }, // leftLeg
  raptor5: { minX: 5, minY: 18, maxX: 23, maxY: 34 }, // rightLeg
  raptor7: { minX: -48, minY: 0, maxX: -30, maxY: 15 } // tail
}
export default (isField, { state, uiScene, field, chieve }) => {
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
  chieve.activate('raptor')
  return true
}

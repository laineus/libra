export default state => {
  const has = key => state.bagItems.map(v => v.key).includes(key)
  const hasAll = (...keys) => keys.every(has)
  const hasSome = (...keys) => keys.some(has)
  const done = key => state.events.itemReactions.includes(key)
  const list = [
    { key: 'lily' },
    { key: 'icePenguin', test: () => hasAll('ice', 'penguin'), scripts: [...t('events.itemReactions.ice'), ...t('events.itemReactions.icePenguin')] },
    { key: 'ice', test: () => !done('icePenguin') && has('ice') },
    { ket: 'bike', test: () => hasSome('bike1', 'bike2', 'bike3') },
    { ket: 'bikeAll', test: () => hasAll('bike1', 'bike2', 'bike3') }
  ]
  return () => {
    const reaction = list.filter(v => !done(v.key)).find(v => v.test ? v.test() : has(v.key))
    if (!reaction) return
    state.events.itemReactions.push(reaction.key)
    return reaction.scripts ?? t(`events.itemReactions.${reaction.key}`)
  }
}

export default state => () => {
  const roomItemKeys = state.roomItems.map(v => v.key)
  const roomItemKeysSet = new Set(roomItemKeys)
  const has = (key, cnt = 1) => cnt > 1 ? roomItemKeys.count(key) >= cnt : roomItemKeysSet.has(key)
  const hasAll = (...keys) => keys.every(key => has(key))
  const hasSome = (...keys) => keys.some(key => has(key))
  const done = key => state.events.itemReactions.includes(key)
  const artNames = (23).toArray().map(i => `art${i}`)
  const list = [
    { key: 'grass' },
    { key: 'lily' },
    { key: 'cosmos' },
    { key: 'dandelion' },
    { key: 'kinoko' },
    { key: 'clover3' },
    { key: 'clover4' },
    { key: 'gardenia' },
    { key: 'strawDoll' },
    { key: 'stoneRock', test: () => hasSome('stone', 'rock') },
    { key: 'gem', test: () => hasSome('sapphire', 'emerald', 'amethyst', 'ruby') },
    { key: 'gemAll', test: () => hasAll('sapphire', 'emerald', 'amethyst', 'ruby') },
    { key: 'crystal', test: () => hasSome('crystal1', 'crystal2') },
    { key: 'raptorParts', test: () => hasSome(...(7).toArray().map(i => `raptor${i + 1}`)) },
    { key: 'raptor' },
    { key: 'fish' },
    { key: 'unagi', test: () => hasSome('uminoke', 'unagi') },
    { key: 'icePenguin', test: () => hasAll('ice', 'penguin'), scripts: [...t('events.itemReactions.ice'), ...t('events.itemReactions.icePenguin')] },
    { key: 'ice', test: () => !done('icePenguin') && has('ice') },
    { key: 'bike', test: () => hasSome('bike1', 'bike2', 'bike3') },
    { key: 'bikeAll', test: () => hasAll('bike1', 'bike2', 'bike3') },
    { key: 'matsutake' },
    { key: 'coin', test: () => hasSome('coinGold', 'coinSilver') },
    { key: 'audioSystem' },
    { key: 'bear' },
    { key: 'bearMany', test: () => has('bear', 3) },
    { key: 'book', test: () => hasSome('book1', 'book2', 'book3') },
    { key: 'candol', test: () => hasSome('candol1', 'candol2') },
    { key: 'chest' },
    { key: 'coffin' },
    { key: 'wine' },
    { key: 'medicine', test: () => hasSome('medicine1', 'medicine2') },
    { key: 'elixir' },
    { key: 'guitar', test: () => hasSome('guitar1', 'guitar2', 'guitar3') },
    { key: 'gun' },
    { key: 'rifle' },
    { key: 'revolver' },
    { key: 'kitchen' },
    { key: 'knife' },
    { key: 'scalpel' },
    { key: 'skul' },
    { key: 'sofa' },
    { key: 'tissue', test: () => state.roomItems.find(v => v.key === 'tissue' && v.x > 610 && v.y < 300) },
    { key: 'trashCan2' },
    { key: 'tv' },
    { key: 'star' },
    { key: 'vendingMachine' },
    { key: 'tea' },
    { key: 'coke' },
    { key: 'insect', test: () => hasSome('ladybird', 'stagBeetle', 'beetle') },
    { key: 'hercules' },
    { key: 'snake' },
    { key: 'flog' },
    { key: 'fallFlog' },
    { key: 'grey', test: () => hasSome('grey1', 'grey2') },
    { key: 'bat' },
    { key: 'pig' },
    { key: 'ghost' },
    { key: 'artAll', test: () => artNames.count(name => has(name)) >= 23 },
    { key: 'artMany', test: () => !done('artAll') && artNames.count(name => has(name)) >= 10 },
    { key: 'art', test: () => !done('artAll') && !done('artMany') && hasSome(...artNames) },
    { key: 'torrent' },
    { key: 'penguin', test: () => hasSome('penguin', 'minePenguin') },
    { key: 'pinkPenguin' },
    { key: 'pumpkin' }
  ]
  const reaction = list.filter(v => !done(v.key)).find(v => v.test ? v.test() : has(v.key))
  if (!reaction) return
  state.events.itemReactions.push(reaction.key)
  return reaction.scripts ?? t(`events.itemReactions.${reaction.key}`)
}

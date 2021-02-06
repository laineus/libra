import { TEMPER } from '@/data/constants'
const PLANT = { normal: TEMPER.STOP, shot: TEMPER.STOP }
const BEAR = { normal: TEMPER.ESCAPE, shot: TEMPER.ATTACK }
const BUG = { normal: TEMPER.RANDOM, shot: TEMPER.RANDOM }
const FISH = { normal: TEMPER.RANDOM, shot: TEMPER.ESCAPE }
const ELEPHANT = { normal: TEMPER.RANDOM, shot: TEMPER.ATTACK }
const CAT = { normal: TEMPER.ATTACK, shot: TEMPER.ESCAPE }
const SHARK = { normal: TEMPER.ATTACK, shot: TEMPER.ATTACK }

const snakeCase = str => {
  str = str.charAt(0).toLowerCase() + str.slice(1)
  return str.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`)
}
const makeItem = (name, obj) => {
  return Object.assign({
    key: name,
    type: 'Substance',
    texture: `item/${snakeCase(name)}`
  }, obj)
}
const makeCharacter = (name, obj) => {
  return Object.assign({
    key: name,
    type: 'Character',
    texture: `chara_sprite/${snakeCase(name)}`,
    temper: PLANT
  }, obj)
}
export default [
  makeItem('flower'),
  makeItem('apple'),
  makeItem('grass', { minScale: 0.6 }),
  makeItem('lily'),
  makeItem('cosmos'),
  makeItem('dandelion'),
  makeItem('kinoko'),
  makeItem('clover3'),
  makeItem('clover4'),
  makeItem('gardenia'),
  makeItem('strawDoll'),
  makeItem('rock', { minScale: 0.6 }),
  makeItem('sapphire', { minScale: 0.6 }),
  makeItem('emerald', { minScale: 0.6 }),
  makeItem('amethyst', { minScale: 0.6 }),
  makeItem('ruby', { minScale: 0.6 }),
  makeItem('crystal', {
    minScale: 0.6,
    drop: [{ key: 'rock', chance: 0.5 }, { key: 'sapphire', chance: 0.25 }, { key: 'emerald', chance: 0.25 }, { key: 'amethyst', chance: 0.25 }, { key: 'ruby', chance: 0.25 }]
  }),
  makeItem('fish', { minScale: 0.7 }),
  makeItem('uminoke', { texture: 'item/unagi' }),
  makeItem('unagi', { minScale: 0.7 }),
  makeItem('ice', {
    minScale: 0.6,
    drop: [{ key: 'fish', chance: 0.5 }, { key: 'fish', chance: 0.5 }, { key: 'unagi', chance: 0.03 }]
  }),
  makeItem('unadon'),
  makeItem('antonLetter', { texture: 'item/letter' }),
  makeItem('pityLetter', { texture: 'item/letter' }),
  makeItem('bike1'),
  makeItem('bike2'),
  makeItem('bike3'),
  makeItem('matsutake'),
  makeItem('coinGold'),
  makeItem('coinSilver'),
  makeItem('elixir'),
  ...(17).toArray().map(i => makeItem(`art${i}`)),
  makeCharacter('ladybird', { temper: BUG }),
  makeCharacter('stagBeetle', { temper: CAT }),
  makeCharacter('beetle', { temper: BEAR }),
  makeCharacter('kajitsu'),
  makeCharacter('torrent', { temper: ELEPHANT }),
  makeCharacter('flog', { temper: CAT }),
  makeCharacter('hercules', { temper: BEAR }),
  makeCharacter('bat', { temper: CAT }),
  makeCharacter('snake', { temper: SHARK }),
  makeCharacter('penguin', { temper: FISH }),
  makeCharacter('minePenguin', { temper: FISH }),
  makeCharacter('fallTorrent', { temper: ELEPHANT }),
  makeCharacter('ghost', { temper: CAT }),
  makeCharacter('pumpkin', { temper: FISH }),
  makeCharacter('amili')
]

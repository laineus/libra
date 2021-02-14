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
    speed: 120,
    standingAnim: false,
    temper: PLANT
  }, obj)
}
export default [
  makeItem('apple', { hp: 25 }),
  makeItem('grass', { hp: 5, minScale: 0.6 }),
  makeItem('lily', { hp: 5 }),
  makeItem('cosmos', { hp: 5 }),
  makeItem('dandelion', { hp: 5 }),
  makeItem('kinoko', { hp: 10, eat: 15 }),
  makeItem('clover3', { hp: 5 }),
  makeItem('clover4', { hp: 5 }),
  makeItem('gardenia', { hp: 5 }),
  makeItem('strawDoll', { hp: 15 }),
  makeItem('rock', { hp: 15, minScale: 0.6 }),
  makeItem('sapphire', { hp: 15, minScale: 0.6 }),
  makeItem('emerald', { hp: 15, minScale: 0.6 }),
  makeItem('amethyst', { hp: 15, minScale: 0.6 }),
  makeItem('ruby', { hp: 15, minScale: 0.6 }),
  makeItem('crystal', {
    hp: 10,
    minScale: 0.6,
    drop: [{ key: 'rock', chance: 0.5 }, { key: 'sapphire', chance: 0.25 }, { key: 'emerald', chance: 0.25 }, { key: 'amethyst', chance: 0.25 }, { key: 'ruby', chance: 0.25 }]
  }),
  makeItem('fish', { hp: 5, minScale: 0.7, eat: 20 }),
  makeItem('uminoke', { hp: 5, texture: 'item/unagi' }),
  makeItem('unagi', { hp: 5, minScale: 0.7 }),
  makeItem('ice', {
    hp: 10,
    minScale: 0.6,
    drop: [{ key: 'fish', chance: 0.5 }, { key: 'fish', chance: 0.5 }, { key: 'unagi', chance: 0.03 }]
  }),
  makeItem('unadon', { hp: 5, eat: 100 }),
  makeItem('antonLetter', { hp: 5, texture: 'item/letter' }),
  makeItem('pityLetter', { hp: 5, texture: 'item/letter' }),
  makeItem('bike1', { hp: 80 }),
  makeItem('bike2', { hp: 80 }),
  makeItem('bike3', { hp: 80 }),
  makeItem('matsutake', { hp: 10 }),
  makeItem('coinGold', { hp: 20 }),
  makeItem('coinSilver', { hp: 20 }),
  makeItem('elixir', { hp: 5, eat: 100 }),
  ...(17).toArray().map(i => makeItem(`art${i}`, { hp: 10 })),
  makeCharacter('ladybird', { hp: 5, atk: 1, temper: BUG, speed: 18 }),
  makeCharacter('stagBeetle', { hp: 5, atk: 3, temper: BEAR, speed: 18 }),
  makeCharacter('beetle', { hp: 5, atk: 2, temper: CAT, speed: 18 }),
  makeCharacter('kajitsu', { hp: 5, atk: 5, damage: false }),
  makeCharacter('torrent', { hp: 100, atk: 60, temper: ELEPHANT, speed: 50 }),
  makeCharacter('flog', { hp: 20, atk: 5, temper: CAT, speed: 30 }),
  makeCharacter('hercules', { hp: 5, atk: 6, temper: BEAR, speed: 18 }),
  makeCharacter('bat', { hp: 10, atk: 5, temper: CAT, speed: 120, standingAnim: true }),
  makeCharacter('snake', { hp: 25, atk: 10, temper: SHARK, speed: 40 }),
  makeCharacter('penguin', { hp: 20, atk: 5, temper: FISH, speed: 50 }),
  makeCharacter('minePenguin', { hp: 15, atk: 15, temper: FISH, speed: 50 }),
  makeCharacter('fallTorrent', { hp: 100, atk: 55, temper: ELEPHANT, speed: 50 }),
  makeCharacter('ghost', { hp: 50, atk: 15, temper: CAT, speed: 60, standingAnim: true, damage: false }),
  makeCharacter('pumpkin', { hp: 20, atk: 15, temper: FISH, speed: 50 }),
  makeCharacter('amili', { hp: 100, atk: 5, damage: false })
]

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
    texture: `item/${snakeCase(name)}`,
    hp: 5,
    weight: 1,
    damage: true,
    capture: true
  }, obj)
}
const makeCharacter = (name, obj) => {
  return Object.assign({
    key: name,
    type: 'Character',
    texture: `chara_sprite/${snakeCase(name)}`,
    hp: 5,
    weight: 1,
    speed: 120,
    standingAnim: false,
    damage: true,
    capture: true,
    temper: PLANT
  }, obj)
}
export default [
  makeItem('apple', { hp: 25, weight: 30 }),
  makeItem('grass', { hp: 5, minScale: 0.6 }),
  makeItem('lily', { hp: 5 }),
  makeItem('cosmos', { hp: 5 }),
  makeItem('dandelion', { hp: 5 }),
  makeItem('kinoko', { hp: 10, eat: 15 }),
  makeItem('clover3', { hp: 5 }),
  makeItem('clover4', { hp: 5 }),
  makeItem('gardenia', { hp: 5 }),
  makeItem('strawDoll', { hp: 15 }),
  makeItem('stone', { hp: 15, minScale: 0.6 }),
  makeItem('rock', { hp: 15, minScale: 0.6 }),
  makeItem('sapphire', { hp: 15, minScale: 0.6 }),
  makeItem('emerald', { hp: 15, minScale: 0.6 }),
  makeItem('amethyst', { hp: 15, minScale: 0.6 }),
  makeItem('ruby', { hp: 15, minScale: 0.6 }),
  makeItem('crystal', {
    hp: 10,
    minScale: 0.7,
    drop: [{ key: 'rock', chance: 0.5 }, { key: 'sapphire', chance: 0.25 }, { key: 'emerald', chance: 0.25 }, { key: 'amethyst', chance: 0.25 }, { key: 'ruby', chance: 0.25 }]
  }),
  makeItem('fish', { hp: 5, minScale: 0.7, eat: 20 }),
  makeItem('uminoke', { hp: 5, texture: 'item/unagi' }),
  makeItem('unagi', { hp: 5, minScale: 0.7 }),
  makeItem('ice', {
    hp: 10,
    minScale: 0.7,
    drop: [{ key: 'fish', chance: 0.5 }, { key: 'fish', chance: 0.5 }, { key: 'unagi', chance: 0.03 }]
  }),
  makeItem('unadon', { hp: 5, eat: 100 }),
  makeItem('antonLetter', { hp: 5, texture: 'item/letter' }),
  makeItem('pityLetter', { hp: 5, texture: 'item/letter' }),
  makeItem('bike1', { hp: 80, weight: 5 }),
  makeItem('bike2', { hp: 80, weight: 5 }),
  makeItem('bike3', { hp: 80, weight: 5 }),
  makeItem('matsutake', { hp: 10 }),
  makeItem('coinGold', { hp: 20 }),
  makeItem('coinSilver', { hp: 20 }),
  makeItem('audioSystem', { hp: 20, weight: 3 }),
  makeItem('bear', { hp: 20, minScale: 0.5 }),
  makeItem('book1', { hp: 5 }),
  makeItem('book2', { hp: 5 }),
  makeItem('book3', { hp: 5 }),
  makeItem('candol1', { hp: 5, light: true }),
  makeItem('candol2', { hp: 5, light: true }),
  makeItem('chest', { hp: 15 }),
  makeItem('coffin', { hp: 15 }),
  makeItem('cookies', { hp: 5 }),
  makeItem('curry', { hp: 5 }),
  makeItem('steak', { hp: 5 }),
  makeItem('stir_fry', { hp: 5 }),
  makeItem('omurice', { hp: 5 }),
  makeItem('lunchbox', { hp: 5 }),
  makeItem('wine', { hp: 5 }),
  makeItem('medicine1', { hp: 5, eat: 50 }),
  makeItem('medicine2', { hp: 5, eat: 50 }),
  makeItem('elixir', { hp: 5, eat: 100 }),
  makeItem('cutting_board', { hp: 5 }),
  makeItem('emblem', { hp: 15 }),
  makeItem('guitar1', { hp: 20, weight: 3 }),
  makeItem('guitar2', { hp: 20, weight: 3 }),
  makeItem('gun', { hp: 10 }),
  makeItem('musket', { hp: 10 }),
  makeItem('revolver', { hp: 10 }),
  makeItem('kitchen', { hp: 25, weight: 3 }),
  makeItem('knife', { hp: 20 }),
  makeItem('lamp', { hp: 10, light: true }),
  makeItem('libra', { hp: 5 }),
  makeItem('logo', { hp: 10 }),
  makeItem('pedestal', { hp: 20, weight: 2, y: -40 }),
  makeItem('pot', { hp: 5 }),
  makeItem('rack1', { hp: 30, weight: 3 }),
  makeItem('rack2', { hp: 30, weight: 3 }),
  makeItem('scalpel', { hp: 20 }),
  makeItem('skul', { hp: 5 }),
  makeItem('sofa', { hp: 30, weight: 3 }),
  makeItem('text', { hp: 5 }),
  makeItem('tissue', { hp: 5 }),
  makeItem('tissueEmpty', { hp: 5 }),
  makeItem('trash', { hp: 5 }),
  makeItem('tv', { hp: 20, weight: 3 }),
  ...(20).toArray().map(i => makeItem(`art${i}`, { hp: 10 })),
  makeCharacter('ladybird', { hp: 5, atk: 1, temper: BUG, speed: 18 }),
  makeCharacter('stagBeetle', { hp: 5, atk: 3, temper: BEAR, speed: 18 }),
  makeCharacter('beetle', { hp: 5, atk: 2, temper: CAT, speed: 18 }),
  makeCharacter('kajitsu', { hp: 5, atk: 5, damage: false, capture: false }),
  makeCharacter('torrent', { hp: 100, atk: 60, temper: ELEPHANT, speed: 50, weight: 5 }),
  makeCharacter('flog', { hp: 20, atk: 5, temper: CAT, speed: 30 }),
  makeCharacter('fallFlog', { hp: 20, atk: 5, temper: SHARK, speed: 30 }),
  makeCharacter('hercules', { hp: 5, atk: 6, temper: BEAR, speed: 18 }),
  makeCharacter('bat', { hp: 10, atk: 5, temper: CAT, speed: 120, standingAnim: true }),
  makeCharacter('snake', { hp: 25, atk: 10, temper: SHARK, speed: 40, weight: 2 }),
  makeCharacter('penguin', { hp: 20, atk: 5, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('minePenguin', { hp: 15, atk: 15, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('signal', { hp: 30, atk: 10, temper: BUG, speed: 40, weight: 2, standingAnim: true }),
  makeCharacter('ghost', { hp: 50, atk: 15, temper: CAT, speed: 60, standingAnim: true, damage: false }),
  makeCharacter('pumpkin', { hp: 20, atk: 15, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('amili', { hp: 100, atk: 5, temper: FISH, damage: false, capture: false })
]

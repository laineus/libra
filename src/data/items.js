import { TEMPER } from '@/data/constants'
import setting from '@/data/setting'
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
    shadow: 0.5,
    temper: PLANT
  }, obj)
}
export default [
  makeItem('apple', { hp: 25, weight: 30 }),
  makeItem('grass', { hp: 5, minScale: 0.6 }),
  makeItem('lily', { hp: 5, y: 2 }),
  makeItem('cosmos', { hp: 5, y: 2 }),
  makeItem('dandelion', { hp: 5, y: 2 }),
  makeItem('kinoko', { hp: 10, eat: 15 }),
  makeItem('clover3', { hp: 5 }),
  makeItem('clover4', { hp: 5 }),
  makeItem('gardenia', { hp: 5, y: 2 }),
  makeItem('moss', { hp: 5, minScale: 0.5, light: 0x225500 }),
  makeItem('strawDoll', { hp: 15 }),
  makeItem('stone', { hp: 15, minScale: 0.6 }),
  makeItem('raptor', { hp: 30, y: -60 }),
  makeItem('raptor1', { hp: 15 }),
  makeItem('raptor2', { hp: 15 }),
  makeItem('raptor3', { hp: 15 }),
  makeItem('raptor4', { hp: 15 }),
  makeItem('raptor5', { hp: 15 }),
  makeItem('raptor6', { hp: 15 }),
  makeItem('raptor7', { hp: 15 }),
  makeItem('rock', { hp: 15, minScale: 0.6 }),
  makeItem('sapphire', { hp: 15, minScale: 0.6 }),
  makeItem('emerald', { hp: 15, minScale: 0.6 }),
  makeItem('amethyst', { hp: 15, minScale: 0.6 }),
  makeItem('ruby', { hp: 15, minScale: 0.6 }),
  makeItem('crystal1', {
    hp: 10,
    minScale: 0.7,
    drop: [{ key: 'rock', chance: 0.5 }, { key: 'sapphire', chance: 0.25 }, { key: 'emerald', chance: 0.25 }, { key: 'amethyst', chance: 0.25 }, { key: 'ruby', chance: 0.25 }]
  }),
  makeItem('crystal2', {
    hp: 10,
    minScale: 0.7,
    drop: [{ key: 'raptor1', chance: 0.1 }, { key: 'raptor2', chance: 0.1 }, { key: 'raptor3', chance: 0.1 }, { key: 'raptor4', chance: 0.1 }, { key: 'raptor5', chance: 0.1 }, { key: 'raptor6', chance: 0.1 }, { key: 'raptor7', chance: 0.1 }]
  }),
  makeItem('fish', { hp: 5, minScale: 0.7, eat: 20 }),
  makeItem('uminoke', { hp: 5, texture: 'item/unagi' }),
  makeItem('unagi', { hp: 5, minScale: 0.7 }),
  makeItem('ice', {
    hp: 10,
    minScale: 0.7,
    light: 0x003366,
    drop: [{ key: 'fish', chance: 0.5 }, { key: 'fish', chance: 0.5 }, { key: 'unagi', chance: 0.05 }, { key: 'pinkPenguin', chance: 0.03 }]
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
  makeItem('candol1', { hp: 5, light: 0xBB5500 }),
  makeItem('candol2', { hp: 5, light: 0xBB5500 }),
  makeItem('chest', { hp: 15, y: -46 }),
  makeItem('coffin', { hp: 15 }),
  makeItem('cookies', { hp: 5, eat: 40 }),
  makeItem('curry', { hp: 5, eat: 70 }),
  makeItem('steak', { hp: 5, eat: 70 }),
  makeItem('stirFry', { hp: 5, eat: 70 }),
  makeItem('omurice', { hp: 5, eat: 70 }),
  makeItem('lunchbox', { hp: 5, eat: 70 }),
  makeItem('wine', { hp: 5, eat: 10 }),
  makeItem('medicine1', { hp: 5, eat: 50 }),
  makeItem('medicine2', { hp: 5, eat: 50 }),
  makeItem('elixir', { hp: 5, eat: 100 }),
  makeItem('cuttingBoard', { hp: 5, y: -5 }),
  makeItem('emblem', { hp: 15 }),
  makeItem('guitar1', { hp: 20, weight: 3 }),
  makeItem('guitar2', { hp: 20, weight: 3 }),
  makeItem('gun', { hp: 10 }),
  makeItem('rifle', { hp: 10 }),
  makeItem('revolver', { hp: 10 }),
  makeItem('kitchen', { hp: 25, weight: 3, y: -50 }),
  makeItem('knife', { hp: 20 }),
  makeItem('lamp', { hp: 10, light: 0xAA6600 }),
  makeItem('libra', { hp: 5 }),
  makeItem('logo', { hp: 10, texture: setting.state.lang === 'ja' ? 'item/logo' : 'item/logo_en' }),
  makeItem('pedestal', { hp: 20, weight: 2, y: -40 }),
  makeItem('pot', { hp: 5, y: -5 }),
  makeItem('rack', { hp: 30, weight: 3, y: -32 }),
  makeItem('scalpel', { hp: 20 }),
  makeItem('skul', { hp: 5 }),
  makeItem('sofa', { hp: 30, weight: 3, y: -30 }),
  makeItem('text', { hp: 5 }),
  makeItem('tissue', { hp: 5 }),
  makeItem('tissueEmpty', { hp: 5 }),
  makeItem('trash', { hp: 5 }),
  makeItem('trashCan1', { hp: 20 }),
  makeItem('trashCan2', { hp: 20, drop: [{ key: 'trash', chance: 1 }, { key: 'trash', chance: 0.8 }, { key: 'trash', chance: 0.7 }] }),
  makeItem('tablemat1', { hp: 5, y: -18 }),
  makeItem('tablemat2', { hp: 5, y: -18 }),
  makeItem('tv', { hp: 20, weight: 3 }),
  makeItem('star', { hp: 5, light: 0x887766 }),
  makeItem('vendingMachine', {
    hp: 50,
    weight: 3,
    drop: [{ key: 'coke', chance: 1 }, { key: 'tea', chance: 1 }, { key: 'coke', chance: 0.8 }, { key: 'tea', chance: 0.8 }, { key: 'coinGold', chance: 1 }, { key: 'coinSilver', chance: 1 }, { key: 'coinSilver', chance: 1 }, { key: 'coinGold', chance: 0.8 }, { key: 'coinSilver', chance: 0.8 }]
  }),
  makeItem('coke', { hp: 5, eat: 30 }),
  makeItem('tea', { hp: 5, eat: 40 }),
  ...(23).toArray().map(i => makeItem(`art${i}`, { hp: 10 })),
  makeCharacter('ladybird', { hp: 5, atk: 1, temper: BUG, speed: 18, shadow: false }),
  makeCharacter('stagBeetle', { hp: 5, atk: 3, temper: BEAR, speed: 18, shadow: false }),
  makeCharacter('beetle', { hp: 5, atk: 2, temper: CAT, speed: 18, shadow: false }),
  makeCharacter('kajitsu', { hp: 5, atk: 5, damage: false, capture: false }),
  makeCharacter('torrent', { hp: 100, atk: 60, temper: ELEPHANT, speed: 50, weight: 5, shadow: 0.8, y: -12 }),
  makeCharacter('flog', { hp: 20, atk: 5, temper: CAT, speed: 30, shadow: 0.4 }),
  makeCharacter('fallFlog', { hp: 20, atk: 5, temper: SHARK, speed: 30, shadow: 0.4 }),
  makeCharacter('hercules', { hp: 5, atk: 6, temper: BEAR, speed: 18, shadow: false }),
  makeCharacter('bat', { hp: 10, atk: 5, temper: CAT, speed: 120, standingAnim: true }),
  makeCharacter('snake', { hp: 25, atk: 10, temper: SHARK, speed: 40, weight: 2, y: -6 }),
  makeCharacter('penguin', { hp: 20, atk: 5, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('pinkPenguin', { hp: 20, atk: 5, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('minePenguin', { hp: 15, atk: 15, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('doctorPenguin', { hp: 15, atk: 15, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('signal', { hp: 30, atk: 10, temper: BUG, speed: 40, weight: 2, standingAnim: true }),
  makeCharacter('ghost', { hp: 50, atk: 15, temper: CAT, speed: 60, standingAnim: true, damage: false }),
  makeCharacter('pumpkin', { hp: 20, atk: 15, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('grey1', { hp: 50, atk: 35, temper: ELEPHANT, speed: 50, weight: 2 }),
  makeCharacter('grey2', { hp: 50, atk: 35, temper: FISH, speed: 50, weight: 2 }),
  makeCharacter('amili', { hp: 100, atk: 5, temper: FISH, damage: false, capture: false, y: -3 })
]

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
    texture: `chara_sprite/${snakeCase(name)}`
  }, obj)
}
export default [
  makeItem('flower'),
  makeItem('apple'),
  makeItem('grass'),
  makeItem('lily'),
  makeItem('cosmos'),
  makeItem('dandelion'),
  makeItem('kinoko'),
  makeItem('clover3'),
  makeItem('clover4'),
  makeCharacter('ladybird'),
  makeCharacter('stagBeetle'),
  makeCharacter('beetle'),
  makeCharacter('kajitsu'),
  makeCharacter('torrent'),
  makeCharacter('flog'),
  makeCharacter('flogLarge'),
  makeCharacter('hercules'),
  makeCharacter('amili')
]

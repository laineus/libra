const makeItem = (name, obj) => {
  return Object.assign({
    key: name,
    type: 'Substance',
    texture: `item/${name}`
  }, obj)
}
const makeCharacter = (name, obj) => {
  return Object.assign({
    key: name,
    type: 'Character',
    texture: `chara_sprite/${name}`
  }, obj)
}
export default [
  makeItem('flower'),
  makeItem('apple'),
  makeItem('grass'),
  makeItem('lily'),
  makeItem('cosmos'),
  makeItem('dandelion'),
  makeCharacter('ladybird'),
  makeCharacter('stagBeetle'),
  makeCharacter('beetle'),
  makeCharacter('kajitsu'),
  makeCharacter('amili')
]

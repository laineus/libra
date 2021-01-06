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
  makeItem('lily'),
  makeItem('cosmos'),
  makeItem('dandelion'),
  makeCharacter('ladybird'),
  makeCharacter('kajitsu'),
  makeCharacter('amili')
]

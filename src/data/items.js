const makeItem = name => {
  return {
    key: name,
    type: 'Substance',
    texture: `item/${name}`
  }
}
const makeCharacter = name => {
  return {
    key: name,
    type: 'Character',
    texture: `chara_sprite/${name}`
  }
}
export default [
  makeItem('flower'),
  makeItem('apple'),
  makeCharacter('kajitsu')
]

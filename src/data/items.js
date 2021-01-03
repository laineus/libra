const makeItem = name => {
  return {
    key: name,
    texture: `item/${name}`
  }
}
const makeCharacter = name => {
  return {
    key: name,
    texture: `chara_sprite/${name}`
  }
}
export default [
  makeItem('flower'),
  makeItem('apple'),
  makeCharacter('kajitsu')
]

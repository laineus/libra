export default (list, pointer, obj) => {
  const nearest = list.slice().sort((a, b) => {
    const distanceToA = Phaser.Math.Distance.Between(a.x, a.y, pointer.worldX, pointer.worldY)
    const distanceToB = Phaser.Math.Distance.Between(b.x, b.y, pointer.worldX, pointer.worldY)
    return distanceToA - distanceToB
  })[0]
  return nearest === obj
}

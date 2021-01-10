import items from '@/data/items'
export default list => {
  return list.reduce((result, data) => {
    const { x, y, width, height, count = 1 } = data
    const chances = typeof data.chance === 'string' ? data.chance.split(',').map(Number) : [data.chance]
    const names = data.name.split(',')
    count.toArray().forEach(() => {
      const randomValue = Math.random()
      const name = names.find((_, i) => {
        return randomValue <= Math.sum(...(i + 1).toArray().map(i => chances[i] ?? 1))
      })
      if (!name) return
      const itemData = items.find(v => v.key === name)
      if (!itemData) throw new Error(`Undefined item name: ${name}.`)
      result.push({
        name,
        type: itemData.type,
        x: Math.randomInt(x, x + width),
        y: Math.randomInt(y, y + height)
      })
    })
    return result
  }, [])
}

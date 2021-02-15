const pathToName = path => path.split('/').slice(-1)[0].split('.')[0]
const mapProperties = (base, properties) => {
  if (properties && Array.isArray(properties)) {
    properties.forEach(property => {
      base[property.name] = property.type === 'color' ? strColorToInt(property.value) : property.value
    })
  }
  return base
}
// const parseArgb = str => {
//   return {
//     alpha: parseInt(str.slice(1, 3), 16) / 255,
//     color: parseInt(str.slice(3), 16)
//   }
// }
const getTilesets = tilemap => {
  return tilemap.tilesets.map(tileset => {
    return tilemap.addTilesetImage(tileset.name, `tileset/${pathToName(tileset.name)}`, 32, 32, 1, 2)
  })
}
const getLayers = tilemap => {
  return tilemap.layers.map((layer, index) => {
    if (!layer.visible) return null
    return mapProperties({ index }, layer.properties)
  }).filter(Boolean)
}
const getUpdateEvent = tilemap => {
  const animationTiles = tilemap.tilesets.map(tileset => {
    return Object.entries(tileset.tileData).filter(([_, d]) => 'animation' in d).map(([localTileId, data]) => {
      const tileId = tileset.firstgid + Number(localTileId)
      const targets = tilemap.layers.filter(v => v.visible).map(l => l.data.flat()).flat().filter(tile => tile.index === tileId)
      const max = Math.sum(...data.animation.map(v => v.duration))
      return { targets, animations: data.animation, max }
    })
  }).flat()
  return (time) => {
    animationTiles.forEach(setting => {
      const current = time % setting.max
      const anim = setting.animations.find((_, i, arr) => {
        return current < Math.sum(...arr.slice(0, i + 1).map(v => v.duration))
      })
      setting.targets.forEach(v => {
        v.index = anim.tileid + 1
      })
    })
  }
}
const strColorToInt = str => parseInt(str.slice(1), 16)
const getImage = tilemap => {
  return tilemap.images.filter(l => l.visible).map(image => {
    return mapProperties({
      key: pathToName(image.image),
      name: image.name,
      x: image.x,
      y: image.y,
      alpha: image.alpha
    }, image.properties)
  })
}
const getObjects = tilemap => {
  return tilemap.objects.filter(l => l.visible).map(v => v.objects).flat().map(data => {
    const fixedRotation = data.rotation > 90 ? data.rotation - 270 : data.rotation + 90
    const result = mapProperties(Object.assign({}, data, { radian: fixedRotation * (Math.PI / 180) }), data.properties)
    delete result.properties
    return result
  })
}
export default (scene, mapKey) => {
  const tilemap = new Phaser.Tilemaps.ParseToTilemap(scene, mapKey)
  const layers = getLayers(tilemap)
  const tilesets = getTilesets(tilemap)
  const images = getImage(tilemap)
  const objects = getObjects(tilemap)
  const update = getUpdateEvent(tilemap)
  const properties = Array.isArray(tilemap.properties) ? mapProperties({}, tilemap.properties) : tilemap.properties

  return {
    name: mapKey,
    tilemap,
    width: tilemap.widthInPixels,
    height: tilemap.heightInPixels,
    layers,
    tilesets,
    images,
    objects,
    update,
    properties
  }
}

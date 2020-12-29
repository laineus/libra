export const DEPTH = {
  GROUND: 0,
  PARTICLES: 100000,
  TOP: 110000,
  LIGHT: 120000,
  SUN_LIGHT: 140000,
  DARKNESS: 130000
}
const mapProperties = (base, properties) => {
  if (properties) {
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
const getTileSettings = (scene, tilemap) => {
  return tilemap.tilesets.map(set => {
    return scene.cache.json.get(set.name).tiles.map(v => {
      return { id: v.id + set.firstgid, setting: v }
    })
  }).flat()
}
const getTileSettingsByType = (settings, type) => {
  return settings.filter(tile => tile.setting.type && tile.setting.type.split(',').includes(type)).map(tile => {
    return mapProperties({ id: tile.id }, tile.setting.properties)
  })
}
const getTilesets = tilemap => {
  return tilemap.tilesets.map(tileset => tilemap.addTilesetImage(tileset.name, `tileset/${tileset.name}`, 32, 32, 1, 2))
}
const getLayers = (tilemap, tileSettings) => {
  const animationTileIds = tileSettings.filter(v => 'animation' in v.setting).map(v => v.id)
  return tilemap.layers.map((layer, index) => {
    if (!layer.visible) return null
    const hasAnimTile = layer.data.flat().some(v => animationTileIds.includes(v.index))
    const component = hasAnimTile ? 'DynamicTilemapLayer' : 'StaticTilemapLayer'
    return mapProperties({ index, component }, layer.properties)
  }).filter(Boolean)
}
const getUpdateEvent = (tilemap, tilesettings) => {
  const animationTiles = tilesettings.filter(v => 'animation' in v.setting).map(v => {
    const targets = tilemap.layers.filter(v => v.visible).map(l => l.data.flat()).flat().filter(tile => tile.index === v.id)
    const max = Math.sum(...v.setting.animation.map(v => v.duration))
    return { targets, animations: v.setting.animation, max }
  })
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
const getImage = rawData => {
  const images = rawData.layers.filter(l => l.visible && l.type === 'imagelayer')
  return images.map(image => {
    return mapProperties({
      id: image.id,
      key: image.image.split('/').slice(-1)[0].split('.')[0],
      name: image.name,
      x: image.offsetx,
      y: image.offsety,
      alpha: image.opacity,
      tint: image.tintcolor ? strColorToInt(image.tintcolor) : null
    }, image.properties)
  })
}
const getObjects = rawData => {
  return rawData.layers.filter(l => l.visible && l.type === 'objectgroup').map(v => v.objects).flat().map(data => {
    const result = mapProperties(Object.assign({}, data, { radian: (data.rotation + 90) * (Math.PI / 180) }), data.properties)
    delete result.properties
    return result
  })
}
export default (scene, mapKey) => {
  const tilemap = new Phaser.Tilemaps.ParseToTilemap(scene, mapKey)
  const rawData = scene.cache.tilemap.get(mapKey).data
  const tileSettings = getTileSettings(scene, tilemap)
  console.log(tilemap)
  console.log(rawData)
  const layers = getLayers(tilemap, tileSettings)
  const tilesets = getTilesets(tilemap)
  const images = getImage(rawData)
  const objects = getObjects(rawData)
  const update = getUpdateEvent(tilemap, tileSettings)
  const getObjectsByType = type => objects.filter(v => v.type === type)

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
    getObjectsByType,
    getTileSettingsByType: type => getTileSettingsByType(tileSettings, type)
  }
}

import config from '@/data/config'
const extendNativeClassFunctions = (screenWidth, screenHeight, tileSize) => {
  // Number instance methods
  Object.defineProperty(Number.prototype, 'half', {
    get () { return this / 2 }
  })
  Object.defineProperty(Number.prototype, 'twice', {
    get () { return this * 2 }
  })
  Object.defineProperty(Number.prototype, 'toTile', {
    get () { return Math.floor(this / tileSize) }
  })
  Object.defineProperty(Number.prototype, 'toPixel', {
    get () { return this * tileSize }
  })
  Object.defineProperty(Number.prototype, 'toPixelCenter', {
    get () { return (this * tileSize) + (tileSize.half) }
  })
  Object.defineProperty(Number.prototype, 'toArray', {
    value () { return [...Array(this).keys()] }
  })
  Object.defineProperty(Number.prototype, 'toColorString', {
    get () { return `#${this.toString(16)}` }
  })
  Object.defineProperty(Number.prototype, 'byRight', {
    get () { return screenWidth - this }
  })
  Object.defineProperty(Number.prototype, 'byBottom', {
    get () { return screenHeight - this }
  })
  // String instance methods
  Object.defineProperty(String.prototype, 'toColorInt', {
    get () { return parseInt(this.slice(1), 16) }
  })
  Object.defineProperty(String.prototype, 'upperCase', {
    get () { return this.replace(/^[a-z]/g, v => v.toUpperCase()) }
  })
  // Array instance methods
  Object.defineProperty(Array.prototype, 'random', {
    value () { return this[Math.randomInt(0, this.length - 1)] }
  })
  Object.defineProperty(Array.prototype, 'count', {
    value (callbackfn) { return this.filter(typeof callbackfn === 'function' ? callbackfn : v => v === callbackfn).length }
  })
  Object.defineProperty(Array.prototype, 'sum', {
    value (callbackfn) { return this.map(callbackfn).reduce((accumulator, current) => accumulator + current, 0) }
  })
  Object.defineProperty(Array.prototype, 'delete', {
    value (callbackfn) {
      const i = this.findIndex(typeof callbackfn === 'function' ? callbackfn : v => v === callbackfn)
      if (i === -1) return
      this.splice(i, 1)
    }
  })
  Object.defineProperty(Array.prototype, 'toObject', {
    value (callbackfn) {
      return Object.fromEntries(this.map(callbackfn))
    }
  })
  Object.defineProperty(Array.prototype, 'findMin', {
    value (callbackfn) {
      return this.reduce((result, record) => {
        const value = callbackfn(record)
        if (!result.record || value < result.value) {
          Object.assign(result, { value, record })
        }
        return result
      }, {}).record
    }
  })
  Object.defineProperty(Array.prototype, 'findMax', {
    value (callbackfn) {
      return this.reduce((result, record) => {
        const value = callbackfn(record)
        if (!result.record || value > result.value) {
          Object.assign(result, { value, record })
        }
        return result
      }, {}).record
    }
  })
  // Phaser
  Object.defineProperty(Phaser.Input.Pointer.prototype, 'isMoved', {
    get () { return Math.hypot(this.downX - this.upX, this.downY - this.upY) > 5 }
  })
  // Math class methods
  Math.sum = (...args) => args.reduce((accumulator, current) => accumulator + current)
  Math.average = (...args) => Math.sum(...args) / args.length
  Math.fix = (value, min, max) => Math.min(Math.max(value, min), max)
  Math.randomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min
  Math.chance = value => value > Math.random()
  // Object class method
  Object.isObject = value => Boolean(value && value.constructor === Object)
  // Array class method
  Array.range = (start, end) => (end - start + 1).toArray().map(i => i + start)
  // Global variables
  window.sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
  window.l = console.log
}
extendNativeClassFunctions(config.WIDTH, config.HEIGHT, config.TILE_SIZE)

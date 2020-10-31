export default class {
  constructor (name, gameObject) {
    this.name = name
    this.gameObject = gameObject
  }
  get x () {
    return this.gameObject.x
  }
  get y () {
    return this.gameObject.y
  }
}

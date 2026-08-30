const GAMEPAD_DEAD_ZONE = 0.25
const NAVIGATION_REPEAT_DELAY = 400
const NAVIGATION_REPEAT_INTERVAL = 100

const GAMEPAD_BUTTONS = {
  confirm: 0,
  cancel: 1,
  bag: 2,
  map: 3,
  menuLeft: 4,
  menuRight: 5,
  grab: 7,
  system: 9
}

export default class InputController {
  constructor (input) {
    this.gamepad = input.gamepad
    input.keyboard.addCapture('W,S,A,D')
    this.movementKeys = [
      { key: input.keyboard.addKey('W'), x: 0, y: -1 },
      { key: input.keyboard.addKey('A'), x: -1, y: 0 },
      { key: input.keyboard.addKey('S'), x: 0, y: 1 },
      { key: input.keyboard.addKey('D'), x: 1, y: 0 }
    ]
    this.listeners = new Map()
    this.navigationDirection = null
    this.navigationRepeatRemaining = NAVIGATION_REPEAT_DELAY
    this.onGamepadButtonDown = (pad, button) => {
      const action = Object.keys(GAMEPAD_BUTTONS).find(action => GAMEPAD_BUTTONS[action] === button.index)
      if (action) this.emit(`${action}start`)
    }
    this.onGamepadButtonUp = (pad, button) => {
      const action = Object.keys(GAMEPAD_BUTTONS).find(action => GAMEPAD_BUTTONS[action] === button.index)
      if (action) this.emit(`${action}end`)
    }
    this.onGamepadConnected = () => this.emit('gamepadchange', true)
    this.onGamepadDisconnected = () => {
      this.emit('grabend')
      this.emit('gamepadchange', this.gamepadConnected)
    }
    this.gamepad?.on('down', this.onGamepadButtonDown)
    this.gamepad?.on('up', this.onGamepadButtonUp)
    this.gamepad?.on('connected', this.onGamepadConnected)
    this.gamepad?.on('disconnected', this.onGamepadDisconnected)
  }

  get gamepadConnected () {
    return Boolean(this.gamepad?.gamepads.some(pad => pad?.connected))
  }

  get velocity () {
    const gamepadVelocity = this.getGamepadVelocity()
    if (gamepadVelocity.x || gamepadVelocity.y) return gamepadVelocity
    return this.movementKeys.filter(v => v.key.isDown).reduce((position, v) => {
      position.x += v.x
      position.y += v.y
      return position
    }, { x: 0, y: 0 })
  }

  getGamepadVelocity () {
    if (!this.gamepad) return { x: 0, y: 0 }
    for (const pad of this.gamepad.gamepads) {
      if (!pad?.connected) continue

      const dpadX = Number(pad.right) - Number(pad.left)
      const dpadY = Number(pad.down) - Number(pad.up)
      if (dpadX || dpadY) return { x: dpadX, y: dpadY }

      const { x, y } = pad.leftStick
      const length = Math.hypot(x, y)
      if (length >= GAMEPAD_DEAD_ZONE) return { x: x / length, y: y / length }
    }
    return { x: 0, y: 0 }
  }

  get rightStick () {
    if (!this.gamepad) return { x: 0, y: 0 }
    for (const pad of this.gamepad.gamepads) {
      if (!pad?.connected) continue
      const { x, y } = pad.rightStick
      if (Math.hypot(x, y) >= GAMEPAD_DEAD_ZONE) return { x, y }
    }
    return { x: 0, y: 0 }
  }

  update (delta = 0) {
    const direction = this.getNavigationDirection()
    const key = direction ? `${direction.x},${direction.y}` : null
    if (!key) {
      this.navigationDirection = null
      this.navigationRepeatRemaining = NAVIGATION_REPEAT_DELAY
      return
    }
    if (key !== this.navigationDirection) {
      this.emit('navigate', direction)
      this.navigationDirection = key
      this.navigationRepeatRemaining = NAVIGATION_REPEAT_DELAY
      return
    }
    this.navigationRepeatRemaining -= delta
    if (this.navigationRepeatRemaining <= 0) {
      this.emit('navigate', direction)
      this.navigationRepeatRemaining += NAVIGATION_REPEAT_INTERVAL
    }
    this.navigationDirection = key
  }

  getNavigationDirection () {
    if (!this.gamepad) return null
    for (const pad of this.gamepad.gamepads) {
      if (!pad?.connected) continue
      const dpad = {
        x: Number(pad.right) - Number(pad.left),
        y: Number(pad.down) - Number(pad.up)
      }
      if (dpad.x || dpad.y) return Math.abs(dpad.x) >= Math.abs(dpad.y) ? { x: dpad.x, y: 0 } : { x: 0, y: dpad.y }

      const sticks = [pad.leftStick, pad.rightStick]
      const stick = sticks.sort((a, b) => Math.hypot(b.x, b.y) - Math.hypot(a.x, a.y))[0]
      if (Math.hypot(stick.x, stick.y) < GAMEPAD_DEAD_ZONE) continue
      return Math.abs(stick.x) >= Math.abs(stick.y)
        ? { x: Math.sign(stick.x), y: 0 }
        : { x: 0, y: Math.sign(stick.y) }
    }
    return null
  }

  on (action, listener) {
    if (!this.listeners.has(action)) this.listeners.set(action, new Set())
    this.listeners.get(action).add(listener)
  }

  off (action, listener) {
    this.listeners.get(action)?.delete(listener)
  }

  emit (action, ...args) {
    this.listeners.get(action)?.forEach(listener => listener(...args))
  }

  destroy () {
    this.gamepad?.off('down', this.onGamepadButtonDown)
    this.gamepad?.off('up', this.onGamepadButtonUp)
    this.gamepad?.off('connected', this.onGamepadConnected)
    this.gamepad?.off('disconnected', this.onGamepadDisconnected)
    this.listeners.clear()
  }
}

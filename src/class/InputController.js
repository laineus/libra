const GAMEPAD_DEAD_ZONE = 0.25

const GAMEPAD_BUTTONS = {
  confirm: 0
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
    this.onGamepadButtonDown = (pad, button) => {
      const action = Object.keys(GAMEPAD_BUTTONS).find(action => GAMEPAD_BUTTONS[action] === button.index)
      if (action) this.emit(action)
    }
    this.gamepad?.on('down', this.onGamepadButtonDown)
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

  on (action, listener) {
    if (!this.listeners.has(action)) this.listeners.set(action, new Set())
    this.listeners.get(action).add(listener)
  }

  off (action, listener) {
    this.listeners.get(action)?.delete(listener)
  }

  emit (action) {
    this.listeners.get(action)?.forEach(listener => listener())
  }

  destroy () {
    this.gamepad?.off('down', this.onGamepadButtonDown)
    this.listeners.clear()
  }
}

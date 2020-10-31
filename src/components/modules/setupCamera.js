export default (camera, width, height, player) => {
  // setup
  camera.setBounds(0, 0, width, height)
  camera.roundPixels = true
  camera.setZoom(1)
  camera.startFollow(player, true, 0.1, 0.1)
  // methods
  camera.updateFollow = () => camera.centerOn(camera._follow.x, camera._follow.y)
  camera.look = (x, y, duration, relative = false) => {
    const newX = relative ? (camera.scrollX + camera.centerX + x) : x
    const newY = relative ? (camera.scrollY + camera.centerY + y) : y
    const offsetX = newX - camera._follow.x
    const offsetY = newY - camera._follow.y
    return new Promise(resolve => {
      camera.pan(newX, newY, duration, 'Power2', false, (_, progress) => {
        if (progress === 1) {
          camera.setFollowOffset(-offsetX, -offsetY)
          resolve()
        }
      })
    })
  }
  camera.revert = (duration = 0) => camera.look(camera._follow.x, camera._follow.y, duration)
  return camera
}

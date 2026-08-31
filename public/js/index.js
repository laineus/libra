window.addEventListener('DOMContentLoaded', () => {
  const isElectron = navigator.userAgent.toLowerCase().includes(' electron/')
  if (isElectron) document.body.classList.add('fullscreen')

  document.querySelector('.fullscreenButton').addEventListener('click', e => {
    e.preventDefault()
    document.body.classList.add('fullscreen')
  })
  document.body.addEventListener('keydown', e => {
    if (isElectron || e.keyCode !== 27) return
    document.body.classList.remove('fullscreen')
  })
})

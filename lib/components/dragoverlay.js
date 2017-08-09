const {remote} = require('electron')
const config = remote.require('./config')

let overlay = null

function init () {
  overlay = document.querySelector('#dragOverlay')
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', () => {
    overlay.classList.remove('active')
  })
}

function onKeyDown (e) {
  if (e.altKey && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
    if (config.getPreference('use_alt_drag') && !remote.getCurrentWindow().isFullScreen()) {
      overlay.classList.add('active')
    }
  } else if (e.shiftKey || e.metaKey || e.ctrlKey) {
    overlay.classList.remove('active')
  }
}

function onKeyUp (e) {
  if (e.keyCode === 18) {
    // ALT
    overlay.classList.remove('active')
  }
}

module.exports = {
  init: init
}

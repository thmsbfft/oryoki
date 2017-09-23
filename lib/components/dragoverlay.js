const {remote} = require('electron')
const config = remote.require('./config')

const rpc = require('../utils/rpc')

let overlay = null
let isActive = false

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
      isActive = true
      overlay.classList.add('active')
      overlay.addEventListener('mouseup', function () {
        // handle separate click and key release
        if (isActive) {
          if (!window.event.altKey) {
            overlay.classList.remove('active')
            isActive = false
          }
        }
      })
    }
  } else if (e.shiftKey || e.metaKey || e.ctrlKey) {
    overlay.classList.remove('active')
    isActive = false
  }
}

function onKeyUp (e) {
  if (e.keyCode === 18 && !e.metaKey) {
    // only alt
    overlay.classList.remove('active')
    isActive = false
    rpc.emit('omnibox:focus')
  }
}

module.exports = {
  init: init
}

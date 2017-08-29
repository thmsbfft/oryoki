const {remote} = require('electron')
const config = remote.require('./config')

const rpc = require('../utils/rpc')

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
  if (e.keyCode === 18 && !e.metaKey && e.target.tagName === 'BODY') {
    // only alt
    overlay.classList.remove('active')
    rpc.emit('omnibox:focus')
  }
}

module.exports = {
  init: init
}

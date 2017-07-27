const {remote} = require('electron')
const menus = remote.require('./menus')
const windows = remote.require('./windows')

const rpc = require('../utils/rpc')

let el = null
let widthInput = null
let heightInput = null

let isShown = false

function init () {
  el = document.querySelector('windowhelper')
  widthInput = el.querySelector('#width')
  heightInput = el.querySelector('#height')

  // rpc
  rpc.on('windowhelper:toggle', toggle)
  rpc.on('windowhelper:update-dimensions', updateWindowDimensions)

  // events
  window.addEventListener('resize', updateWindowDimensions)
  widthInput.addEventListener('click', () => { widthInput.select() })
  heightInput.addEventListener('click', () => { heightInput.select() })
  el.addEventListener('keyup', onInputKeyUp)
  el.addEventListener('keydown', onInputKeyDown)

  updateWindowDimensions()
  hide()
  console.log('[windowhelper] ✔')
}

function updateWindowDimensions () {
  widthInput.value = window.innerWidth
  heightInput.value = window.innerHeight

  updateUI()
}

function updateUI () {
  if (widthInput.value <= 1000) {
    el.querySelectorAll('#width')[0].className = ''
  }

  if (heightInput.value <= 1000) {
    el.querySelectorAll('#height')[0].className = ''
  }

  if (widthInput.value >= 1000) {
    el.querySelectorAll('#width')[0].className = 'leadingOne'
  }

  if (heightInput.value >= 1000) {
    el.querySelectorAll('#height')[0].className = 'leadingOne'
  }

  if (widthInput.value >= 2000) {
    el.querySelectorAll('#width')[0].className = 'fourDigits'
  }

  if (heightInput.value >= 2000) {
    el.querySelectorAll('#height')[0].className = 'fourDigits'
  }
}

function show () {
  isShown = true
  el.className = 'show'

  widthInput.select()
}

function hide () {
  isShown = false
  el.className = 'hide'
}

function toggle () {
  if (isShown) hide()
  else show()
}

function onInputKeyUp (e) {
  if(e.key == 'Escape') {
    hide()
    rpc.emit('omnibox:focus')
    menus.refresh()
  }

  // ignore keys we dont have a use for
  if (e.key.match(/[a-z]/i) && e.key.length == 1 || e.keyCode == 9) e.preventDefault()

  switch (e.keyCode) {
    case 9:
      // tab
      if (e.target.id == 'width') heightInput.select()
      else widthInput.select()
      break

    case 13:
      // enter
      windows.resize(widthInput.value, heightInput.value)
      break
  }

  updateUI()
}

function onInputKeyDown (e) {
  // ignore keys we dont have a use for
  if (e.metaKey == false && e.key.match(/[a-z]/i) && e.key.length == 1 || e.keyCode == 9 || e.keyCode == 38 || e.keyCode == 40) e.preventDefault()

  switch (e.keyCode) {
    case 38:
      // arrow Up
      increment(e, 'up')
      e.target.select()
      break

    case 40:
      // arrow Down
      increment(e, 'down')
      e.target.select()
      break
  }

  updateUI()
}

function increment (e, direction) {
  switch(direction) {
    case 'up':
      if (e.shiftKey) {
        e.target.value = parseInt(e.target.value) + 10
      } else {
        e.target.value = parseInt(e.target.value) + 1
      }
      break

    case 'down':
      if (e.shiftKey) {
        e.target.value = parseInt(e.target.value) - 10
      } else {
        e.target.value = parseInt(e.target.value) - 1
      }
      break
  }
}

module.exports = {
  init
}
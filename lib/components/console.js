const {remote} = require('electron')
const menus = remote.require('./menus')
const rpc = require('../utils/rpc')

// elements
let el = null
let input = null
let webview = null

// utils
let isShown = false

function init () {
  el = document.querySelector('console')
  input = el.querySelector('input')
  webview = document.querySelector('webview')

  input.addEventListener('keyup', onKeyUp)
  webview.addEventListener('console-message', onMessage)

  rpc.on('console:toggle', toggle)
  console.log('[console] ✔')
}

function onMessage (e) {
  input.value = e.message
}

function submit () {
  webview.executeJavaScript(input.value)
  clear()
}

function clear () {
  input.value = ''
}

function onKeyUp (e) {
  if(e.keyCode == 13) submit()
  if(e.key == 'Escape') hide()
}

function toggle () {
  if(isShown) hide()
  else show()
}

function show () {
  win = remote.getCurrentWindow()
  el.classList.add('show')
  isShown = true
  win.hasConsole = true
  menus.refresh()
}

function hide() {
  win = remote.getCurrentWindow()
  el.classList.remove('show')
  isShown = false
  win.hasConsole = false
  menus.refresh()
}

module.exports = {
  init,
  toggle
}
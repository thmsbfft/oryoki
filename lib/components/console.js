const {remote} = require('electron')
const menus = remote.require('./menus')
const rpc = require('../utils/rpc')

// elements
let el = null
let input = null
let webview = null
let drag = null

// utils
let history = []
let isDragging = false
let minHeight = 0
let isShown = false

function init () {
  el = document.querySelector('console')
  input = el.querySelector('input')
  drag = el.querySelector('drag')
  webview = document.querySelector('webview')

  input.addEventListener('keyup', onKeyUp)
  webview.addEventListener('console-message', onMessage)
  drag.addEventListener('mousedown', onDragStart)
  window.addEventListener('resize', onResize)

  rpc.on('console:toggle', toggle)
  console.log('[console] ✔')
}

function onMessage (e) {
  let message = document.createElement('p')
  message.innerText = e.message

  input.after(message)
  clear()
}

function onDragStart (e) {
  isDragging = true
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag (e) {
  let newHeight = window.innerHeight - e.clientY
  if(newHeight < minHeight) newHeight = minHeight
  else if(newHeight > window.innerHeight * 0.75) newHeight = window.innerHeight * 0.75

  el.style.height = newHeight + "px"
}

function onResize () {
  console.log(el.offsetHeight)
  if(el.offsetHeight > window.innerHeight * 0.75) {
    el.style.height = window.innerHeight * 0.75 + "px"
  }
}

function stopDrag () {
  isDragging = false
  window.removeEventListener('mousemove', onDrag)
}

function submit () {
  webview.executeJavaScript(input.value)
  clear()
}

function clear () {
  input.value = ''
  input.focus()
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
  minHeight = input.offsetHeight
  input.focus()
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
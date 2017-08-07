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
let historyIndex = 0
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
  el.addEventListener('mouseup', (e) => {
    input.focus()
  })

  rpc.on('console:toggle', toggle)
  console.log('[console] ✔')
}

function onMessage (e) {
  let message = document.createElement('p')
  message.innerText = e.message

  input.after(message)
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
  if(el.offsetHeight > window.innerHeight * 0.75) {
    el.style.height = window.innerHeight * 0.75 + "px"
  }
}

function stopDrag () {
  isDragging = false
  window.removeEventListener('mousemove', onDrag)
}

function submit () {
  if(input.value == 'clear()') clear()

  webview.executeJavaScript(input.value)
  history.unshift(input.value)
  historyIndex = -1
  input.value = ''
  input.focus()
}

function clear () {
  history = []

  let messages = el.querySelector('p')
  while (messages.firstChild) {
    messages.removeChild(messages.firstChild);
  }

  input.value = ''
  input.focus()
}

function onKeyUp (e) {
  if(e.keyCode == 13) submit()
  if(e.key == 'Escape') hide()

  if(e.keyCode == 38) {
    // up
    historyIndex++
    if(historyIndex > history.length - 1) {
      historyIndex = history.length - 1
      return
    }
    e.preventDefault()
    input.value = history[historyIndex]
    input.focus()
  }
  if(e.keyCode == 40) {
    // down
    historyIndex--
    if(historyIndex < 0) {
      historyIndex = -1
      input.value = ''
      input.focus()
      return
    }
    e.preventDefault()
    input.value = history[historyIndex]
    input.focus()
  }
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
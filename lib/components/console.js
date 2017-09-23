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
let minHeight = 0
let isShown = false
let isFirstLoad = true

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
  rpc.on('omnibox:submit', reset)
  rpc.on('view:title-updated', reset)
  console.log('[console] ✔')
}

function onMessage (e) {
  let message = e.message
  message = message.split(' ').join('&nbsp')

  // strip style markup
  message = message.split('%c').join('')
  message = message.split('%s').join('')

  let line = document.createElement('p')
  line.innerHTML = message

  input.after(line)
}

function onDragStart (e) {
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

function onDrag (e) {
  let newHeight = window.innerHeight - e.clientY
  if (newHeight < minHeight) newHeight = minHeight
  else if (newHeight > window.innerHeight * 0.75) newHeight = window.innerHeight * 0.75

  el.style.height = newHeight + 'px'
}

function onResize () {
  if (el.offsetHeight > window.innerHeight * 0.75) {
    el.style.height = window.innerHeight * 0.75 + 'px'
  }
}

function stopDrag () {
  window.removeEventListener('mousemove', onDrag)
}

function submit () {
  history.unshift(input.value)
  historyIndex = -1

  if (input.value === 'clear()') {
    clear()
    return
  }
  webview.executeJavaScript(input.value)

  input.value = ''
  input.focus()
}

function clear () {
  console.log('[console] Clearing')

  let messages = el.querySelectorAll('p')

  while (messages.length > 0) {
    messages[0].parentNode.removeChild(messages[0])
    messages = el.querySelectorAll('p')
  }

  input.value = ''
  input.focus()
}

function reset () {
  clear()
  history = []
  isFirstLoad = true
  var wasShown = isShown
  hide()
  if (wasShown) show()
}

function onKeyUp (e) {
  if (e.keyCode === 13) submit()
  if (e.key === 'Escape') hide()

  if (e.keyCode === 38) {
    // up
    historyIndex++
    if (historyIndex > history.length - 1) {
      historyIndex = history.length - 1
      return
    }
    e.preventDefault()
    input.value = history[historyIndex]
    input.focus()
  }
  if (e.keyCode === 40) {
    // down
    historyIndex--
    if (historyIndex < 0) {
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
  if (isShown) hide()
  else show()
}

function show () {
  const win = remote.getCurrentWindow()
  el.classList.add('show')
  isShown = true
  win.hasConsole = true
  minHeight = input.offsetHeight

  if (isFirstLoad) {
    isFirstLoad = false

    // show as many messages as possible
    // or show 2 rows if console is empty
    let height = input.offsetHeight * (1 + el.querySelectorAll('p').length)
    if (height > window.innerHeight * 0.75) {
      height = window.innerHeight * 0.75
    } else if (height === input.offsetHeight) {
      height = height * 2
    }

    el.style.height = height + 'px'
  }

  input.focus()
  menus.refresh()
}

function hide () {
  const win = remote.getCurrentWindow()
  el.classList.remove('show')
  isShown = false
  win.hasConsole = false
  menus.refresh()
}

module.exports = {
  init,
  toggle
}

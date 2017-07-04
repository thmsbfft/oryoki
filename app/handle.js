const {remote, ipcRenderer} = require('electron')
const config = remote.require('./config')

let el = undefined
let titleEl = undefined

var title = 'Ōryōki'
var isShown = config.getPreference('show_title_bar')
var isDisabled = false

function init () {
  el = document.querySelector('handle')
  titleEl = el.querySelector('.title')
  
  el.querySelector('.button.close').addEventListener('click', () => {
    remote.getCurrentWindow().close()
  })

  el.querySelector('.button.minimize').addEventListener('click', () => {
    remote.getCurrentWindow().minimize()
  })

  el.querySelector('.button.fullscreen').addEventListener('click', () => {
    remote.getCurrentWindow().setFullScreen(true)
    hide()
  })

  ipcRenderer.on('toggle-handle', toggle)

  if(isShown) show()
  else hide()
  console.log('[handle] ✔')
  updateTitle('Pouet')
}

function show () {
  el.classList.remove('hide')
  win = remote.getCurrentWindow()
  win.setSize(
    win.getSize()[0],
    win.getSize()[1] + 24
  )
  isShown = true
}

function hide () {
  el.classList.add('hide')
  win = remote.getCurrentWindow()
  win.setSize(
    win.getSize()[0],
    win.getSize()[1] - 24
  )
  isShown = false
}

function toggle () {
  if(isShown) hide()
  else show()
}

function disable () {
  el.classList.add('disabled')
  isDisabled = true
}

function enable () {
  el.classList.remove('disabled')
  isDisabled = false
}

function updateTitle (newTitle) {
  titleEl.setAttribute('title', newTitle)
  title = newTitle
  titleEl.innerText = newTitle
  // rpc.emit('update-title', newTitle)
}

module.exports = {
  init: init,
  show: show,
  hide: hide,
  updateTitle: updateTitle
}
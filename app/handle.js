const {remote, ipcRenderer} = require('electron')
const config = remote.require('./config')

let el = undefined

var title = 'Ōryōki'
var isShown = config.getPreference('show_title_bar')
var isDisabled = false

function init () {
  el = document.querySelector('handle')
  
  document.querySelector('.button.close').addEventListener('click', () => {
    remote.getCurrentWindow().close()
  })

  document.querySelector('.button.minimize').addEventListener('click', () => {
    remote.getCurrentWindow().minimize()
  })

  document.querySelector('.button.fullscreen').addEventListener('click', () => {
    remote.getCurrentWindow().setFullScreen(true)
    hide()
  })

  if(isShown) show()
  else hide()
  console.log('[handle] ✔')
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

function disable () {
  el.classList.add('disabled')
  isDisabled = true
}

function enable () {
  el.classList.remove('disabled')
  isDisabled = false
}

module.exports = {
  init: init
}
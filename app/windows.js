const {app, ipcMain} = require('electron')

const config = require('./config')
const Window = require('./Window')

let windows = []
let index = 0
let focused = null

function init() {
  // ipcMain.on('new-window', )
  // ipcMain.on('close-window', )
  // ipcMain.on('minimize-window', )
  // ipcMain.on('fullscreen-window', )
  create()
}

function create() {
  console.log('[window] Creating new window')

  var width;
  var height;

  if (windows.length === 0) {
    width = config.getPreference('default_window_width')
    height = config.getPreference('default_window_height')

    windows.push(new Window({
      'id' : index,
      'width' : width,
      'height' : height
    }))
    windows[windows.length - 1].browser.center()
  }
  else {
    width = this.focused.browser.getPosition()[0] + 50
    height = this.focused.browser.getPosition()[1] + 50

    windows.push(new Window({
      'id' : index,
      'width' : width,
      'height' : height
    }))
  }

  windows.forEach(function (window) {
    console.log('✘')
  })

  index++
}

function onFocusChange(window) {
  focused = window
  console.log('[windows] Focus: ' + focused.id)
}

module.exports = {
  init: init,
  create: create,
  onFocusChange: onFocusChange
}
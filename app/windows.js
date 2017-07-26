const {app, BrowserWindow, ipcMain} = require('electron')

const menus = require('./menus')
const config = require('./config')
const createRPC = require('./rpc')

const windows = new Set([])
let focused = null

function init () {

  app.on('activate', () => {
    if (!windows.size) {
      create()
    }
  })

  create()
}

function create (url) {
  console.log('[windows] Creating new window')

  if (url && focused !== null && focused.isFirstLoad) {
    // if there is a focused window and nothing's loaded yet, load url
    // here instead of creating a new window
    focused.rpc.emit('view:load', url)
    return
  }

  var width
  var height
  var x
  var y

  if (!windows.size) {
    width = config.getPreference('default_window_width')
    height = config.getPreference('default_window_height')
    x = 0
    y = 0
  } else {
    width = focused.getBounds().width
    height = focused.getBounds().height
    x = focused.getPosition()[0] + 60
    y = focused.getPosition()[1] + 60
  }

  const browserOptions = {
    x: x,
    y: y,
    width: width,
    height: height,
    frame: false,
    backgroundColor: '#141414',
    show: false,
    minWidth: 200,
    minHeight: 200,
    darkTheme: true,
    webPreferences: {
      'experimentalFeatures': true,
      'experimentalCanvasFeatures': true
    }
    // fullscreenable: !config.getPreference('picture_in_picture')
  }

  const win = new BrowserWindow(browserOptions)
  if (!windows.size) win.center()
  windows.add(win)

  const rpc = createRPC(win)
  win.rpc = rpc
  win.isFirstLoad = true

  win.loadURL('file://' + __dirname + '/window.html' + '#' + win.id)

  win.on('focus', (e) => {
    focused = e.sender
    menus.refresh()
  })

  win.on('close', () => {
    console.log('closing window')
    windows.delete(win)
    rpc.destroy()
  })

  rpc.on('view:first-load', (e) => {
    win.isFirstLoad = false
  })

  rpc.on('view:title-updated', (e) => {
    win.setTitle(e)
  })

  win.once('ready-to-show', () => {
    win.show()
    if(url) win.rpc.emit('view:load', url)
  })

  win.webContents.openDevTools()
}

function broadcast (data) {
  for (let win of windows) {
    win.webContents.send(data)
  }
}

function cycle () {
  wins = Array.from(windows)
  var focused = null
  for (var i = 0; i < wins.length; i++) {
    if (wins[i].isFocused()) focused = i
  }
  var next = focused + 1
  if(next > wins.length - 1) next = 0
  wins[next].focus()
}

function getFocused () {
  return focused
}

module.exports = {
  init: init,
  create: create,
  broadcast: broadcast,
  cycle: cycle,
  getFocused: getFocused
}

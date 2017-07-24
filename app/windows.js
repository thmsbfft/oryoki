const {app, BrowserWindow, ipcMain} = require('electron')

const config = require('./config')
const createRPC = require('./rpc')

const windows = new Set([])
let focused = null

function init () {
  // ipcMain.on('new-window', )
  // ipcMain.on('close-window', )
  // ipcMain.on('minimize-window', )
  // ipcMain.on('fullscreen-window', )

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
    x = focused.getPosition()[0] + 50
    y = focused.getPosition()[1] + 50
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
  })

  win.on('close', () => {
    windows.delete(win)
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

module.exports = {
  init: init,
  create: create,
  broadcast: broadcast
}

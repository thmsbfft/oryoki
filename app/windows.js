const {app, BrowserWindow, ipcMain} = require('electron')

const config = require('./config')

const windows = new Set([])
let focused = undefined

function init() {

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

function create() {
  console.log('[window] Creating new window')

  var width;
  var height;
  var x;
  var y;

  if (!windows.size) {
    width = config.getPreference('default_window_width')
    height = config.getPreference('default_window_height')
    x = 0
    y = 0
  }
  else {
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
    frame: true,
    backgroundColor: '#141414',
    show: false,
    minWidth: 200,
    minHeight: 200,
    darkTheme: true,
    webPreferences: {
      'experimentalFeatures': true,
      'experimentalCanvasFeatures': true
    },
    // fullscreenable: !config.getPreference('picture_in_picture')
  }

  const win = new BrowserWindow(browserOptions)
  if (!windows.size) win.center()
  windows.add(win)
  
  win.loadURL('file://' + __dirname + '/window.html' + '#' + win.id)

  win.on('focus', (e) => {
    focused = e.sender
  })

  win.on('close', () => {
    windows.delete(win)
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.webContents.on('dom-ready', () => {
    win.webContents.send('ready')
  })

  win.webContents.openDevTools()
}

module.exports = {
  init: init,
  create: create
}
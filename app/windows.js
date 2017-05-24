const {app, BrowserWindow, ipcMain} = require('electron')

const config = require('./config')

let windows = []
let index = 0
let focused = null

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

  // if (windows.length === 0) {
    width = config.getPreference('default_window_width')
    height = config.getPreference('default_window_height')
    x = 0
    y = 0
  // }
  // else {
  //   width = this.focused.getBounds().width
  //   height = this.focused.getBounds().height
  //   x = this.focused.getPosition()[0] + 50
  //   y = this.focused.getPosition()[1] + 50
  // }

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
    fullscreenable: !config.getPreference('picture_in_picture')
  }

  const win = new BrowserWindow(browserOptions)
  windows.push(win)
  windows[windows.length - 1].center()

  win.loadURL('file://' + __dirname + '/window.html' + '#' + win.id)

  win.once('ready-to-show', () => {
    win.show()
  })
}

function getFocusedWindow () {
  return BrowserWindow.getFocusedWindow()
}

module.exports = {
  init: init,
  create: create,
  getFocusedWindow: getFocusedWindow
}
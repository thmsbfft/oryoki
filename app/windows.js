const path = require('path')
const {app, BrowserWindow} = require('electron')
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

function create (url, target) {
  console.log('[windows] Creating new window')

  if ((url && focused !== null && focused.isFirstLoad) || target === '_self') {
    // if there is a focused window and nothing's loaded yet,
    // or target has been set (to '_self'),
    // load url here instead of creating a new window
    focused.rpc.emit('view:load', url)
    focused.rpc.emit('status:log', {
      body: 'Loading ' + url
    })
    return
  }

  let width
  let height
  let x
  let y

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
    },
    fullscreenable: !config.getPreference('picture_in_picture'),
  }

  const win = new BrowserWindow(browserOptions)
  if (!windows.size) win.center()
  windows.add(win)

  let rpc = createRPC(win)
  win.rpc = rpc

  // set a couple properties to be used in renderer process and menus
  win.isFirstLoad = true
  win.darkTheme = true
  win.hasTitleBar = config.getPreference('show_title_bar')
  win.hasConsole = false
  win.isRequestMobile = config.getPreference('request_mobile_site')

  win.loadURL(path.join('file://', __dirname, '/window.html'))

  win.on('focus', (e) => {
    focused = e.sender
    menus.refresh()
  })

  win.on('close', () => {
    windows.delete(win)
    rpc.destroy()
    rpc = null

    if (windows.size === 0) {
      focused = null
      menus.refresh()
    }
  })

  rpc.on('theme:updated', (e) => {
    win.darkTheme = e
    menus.refresh()
  })

  rpc.on('view:first-load', (e) => {
    win.isFirstLoad = false
  })

  rpc.on('view:title-updated', (e) => {
    win.setTitle(e)
  })

  rpc.on('view:toggle-mobile-updated', (e) => {
    win.isRequestMobile = e
    menus.refresh()
  })

  win.once('ready-to-show', () => {
    win.show()
    if (url) {
      win.rpc.emit('view:load', url)
      win.rpc.emit('status:log', {
        body: 'Loading ' + url
      })
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    win.webContents.openDevTools()
  }
}

function broadcast (data) {
  for (let win of windows) {
    win.rpc.emit(data)
  }
}

function cycle () {
  let wins = Array.from(windows)
  var focused = null
  for (var i = 0; i < wins.length; i++) {
    if (wins[i].isFocused()) focused = i
  }
  var next = focused + 1
  if (next > wins.length - 1) next = 0
  wins[next].focus()
}

function toggleFullScreen () {
  focused.rpc.emit('handle:hide')

  // highjack native fullscreen to enable picture in picture
  if (config.getPreference('picture_in_picture')) {
    focused.setFullScreenable(true)
    focused.setFullScreen(!focused.isFullScreen())
    focused.setFullScreenable(false)
  } else {
    focused.setFullScreen(!focused.isFullScreen())
  }

  menus.refresh()
}

function resize (width, height) {
  width = parseInt(width)
  height = parseInt(height)

  const electronScreen = require('electron').screen
  let currentScreen = electronScreen.getDisplayMatching(focused.getBounds())
  let x = focused.getBounds().x
  let y = focused.getBounds().y

  // if requested dimensions are supperior to current screen,
  // default to work area size
  if (width > currentScreen.workArea.width) {
    width = currentScreen.workArea.width
    x = currentScreen.workArea.x
  }
  if (height > currentScreen.workArea.height) {
    height = currentScreen.workArea.height
    y = currentScreen.workArea.y
  }

  if (width < focused.minWidth) {
    width = focused.minWidth
  }

  if (height < focused.minHeight) {
    height = focused.minHeight
  }

  focused.setBounds({
    x: x,
    y: y,
    width: width,
    height: height
  }, true)

  focused.rpc.emit('windowhelper:update-dimensions')
}

function getFocused () {
  return focused
}

module.exports = {
  init,
  create,
  broadcast,
  cycle,
  toggleFullScreen,
  getFocused,
  resize
}

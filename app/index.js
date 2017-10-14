'use strict'
process.env['PATH'] = '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

// packages
const {app} = require('electron')

// oryoki
const config = require('./config')
const updater = require('./updater')
const fileHandler = require('./fileHandler')
const menus = require('./menus')
const about = require('./about')
const notify = require('./notify')
const camera = require('./camera')
const windows = require('./windows')

app.commandLine.appendSwitch('ignore-certificate-errors')

app.on('ready', function () {
  console.log('[~~~~~~] ' + app.getName())
  console.log('[~~~~~~] ' + app.getVersion())

  config.init()
  updater.init()
  fileHandler.init()
  about.init()
  menus.init()
  notify.init()
  camera.init()
  windows.init()
})

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    // disable node integration for remote content
    webPreferences.nodeIntegration = false

    // don't load if preload url isn't local to the app
    if (!webPreferences.preloadURL.startsWith('file://')) event.preventDefault()
  })
})

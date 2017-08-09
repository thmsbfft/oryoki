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

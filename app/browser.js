'use strict'

// Packages
const {remote, ipcRenderer} = require('electron')
const config = remote.require('./config')

// Oryoki
const handle = require('./handle')

// console.log(config.getPreference('use_alt_drag'))

ipcRenderer.on('ready', function () {
  console.log('[browser] Starting up...')
  handle.init()
})

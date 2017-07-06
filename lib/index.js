// Packages
const {remote, ipcRenderer} = require('electron')
const config = remote.require('./config')

// Styles
require('./sass/bundle.scss')

// Oryoki
const rpc = require('./utils/rpc')
const handle = require('./components/handle')

// console.log(config.getPreference('use_alt_drag'))

ipcRenderer.on('init', function (e, uid) {
  console.log('[browser]', uid)
  handle.init()
})

// Packages
const {remote, ipcRenderer} = require('electron')
const config = remote.require('./config')

// Styles
require('./sass/bundle.scss')

// Oryoki
const rpc = require('./utils/rpc')
const handle = require('./components/handle')

rpc.on('ready', function (e, uid) {
  console.log('[rpc] ✔', rpc.id)
  handle.init()
})

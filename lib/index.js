// Styles
require('./sass/bundle.scss')

// Oryoki
const rpc = require('./utils/rpc')
const handle = require('./components/handle')
const omnibox = require('./components/omnibox')

rpc.on('ready', function (e, uid) {
  console.log('[rpc] ✔', rpc.id)
  handle.init()
  omnibox.init()
})

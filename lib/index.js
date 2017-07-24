// Styles
require('./sass/bundle.scss')

// Oryoki
const rpc = require('./utils/rpc')
const handle = require('./components/handle')
const omnibox = require('./components/omnibox')
const view = require('./components/view')
const status = require('./components/status')
const dragoverlay = require('./components/dragoverlay')

rpc.on('ready', function (e, uid) {
  console.log('[rpc] ✔', rpc.id)
  status.init()
  handle.init()
  omnibox.init()
  view.init()
  dragoverlay.init()
})
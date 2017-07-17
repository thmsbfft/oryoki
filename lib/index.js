// Styles
require('./sass/bundle.scss')

// Oryoki
const rpc = require('./utils/rpc')
const handle = require('./components/handle')
const omnibox = require('./components/omnibox')
const view = require('./components/view')
const dragoverlay = require('./components/dragoverlay')

rpc.on('ready', function (e, uid) {
  console.log('[rpc] ✔', rpc.id)
  handle.init()
  omnibox.init()
  view.setup()
  dragoverlay.setup()
})

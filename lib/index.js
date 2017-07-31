// styles
require('./sass/bundle.scss')

// oryoki
const rpc = require('./utils/rpc')
const handle = require('./components/handle')
const omnibox = require('./components/omnibox')
const windowhelper = require('./components/windowhelper')
const view = require('./components/view')
const status = require('./components/status')
const dragoverlay = require('./components/dragoverlay')
const theme = require('./components/theme')

rpc.on('ready', function (e, uid) {
  console.log('[rpc] ✔', rpc.id)
  status.init()
  handle.init()
  theme.init()
  omnibox.init()
  windowhelper.init()
  view.init()
  dragoverlay.init()
})

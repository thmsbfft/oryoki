const {remote} = require('electron')
const menus = remote.require('./menus')
const config = remote.require('./config')
const windows = remote.require('./windows')
const status = require('./status')
const rpc = require('../utils/rpc')

let el = null
let webview = null
let frame = null

// utils
let isFirstLoad = true
let requestMobileSiteActive = false
let userAgentDefault = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Oryoki/0.2.1 Chrome/58.0.3029.110 Electron/1.7.9 Safari/537.36'
let userAgentMobile = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A356 Safari/604.1'
let zoomIndex = 6
const zoomIncrements = [
  25 / 100,
  33 / 100,
  50 / 100,
  67 / 100,
  75 / 100,
  90 / 100,
  100 / 100,
  110 / 100,
  125 / 100,
  150 / 100,
  175 / 100,
  200 / 100
]

function init () {
  el = document.querySelector('#view')
  frame = document.querySelector('#frame')

  webview = el.appendChild(document.createElement('webview'))
  webview.className = 'webview'

  let webPreferences = 'nodeIntegration=no, contextIsolation=yes'

  webview.setAttribute('webPreferences', JSON.stringify(webPreferences))
  webview.setAttribute('plugins', 'plugins')
  webview.setAttribute('preload', './dist/preload.js')

  if (config.getPreference('request_mobile_site')) {
    webview.setAttribute('useragent', userAgentMobile)
    requestMobileSiteActive = true
  }

  console.log('[view] ✔')
  attachEvents()
}

function attachEvents () {
  // webview events
  webview.addEventListener('contextmenu', require('./contextmenu').open)
  webview.addEventListener('load-commit', onLoadCommit)
  webview.addEventListener('page-title-updated', (e) => {
    rpc.emit('view:title-updated', e.title)
  })
  webview.addEventListener('update-target-url', (e) => {
    if (config.getPreference('show_url_preview')) {
      if (e.url !== '') rpc.emit('status:url-hover', e.url)
      if (e.url === '') rpc.emit('status:url-out')
    }
  })
  webview.addEventListener('ipc-message', (e) => {
    if (e.channel !== 'webview:data') return
    console.log('[webview]', e.args[0])
  })
  webview.addEventListener('did-frame-finish-load', (e) => {
    rpc.emit('theme:extract-color')
  })
  webview.addEventListener('new-window', (e) => {
    if (config.getPreference('follow_all_links')) {
      load(e.url)
    } else {
      windows.create(e.url)
    }
  })

  // errors
  webview.addEventListener('crashed', onCrashed)
  webview.addEventListener('gpu-crashed', onCrashed)
  webview.addEventListener('plugin-crashed', onCrashed)
  webview.addEventListener('did-fail-load', onDidFailLoad)

  // webview.addEventListener('did-get-response-details', onDidGetResponseDetails)
  // webview.addEventListener('dom-ready', onDOMReady)

  // rpc events
  rpc.on('view:load', load)
  rpc.on('view:reload', reload)
  rpc.on('view:hard-reload', reloadIgnoringCache)
  rpc.on('view:navigate-back', navigateBack)
  rpc.on('view:navigate-forward', navigateForward)
  rpc.on('view:zoom-in', zoomIn)
  rpc.on('view:zoom-out', zoomOut)
  rpc.on('view:reset-zoom', resetZoom)
  rpc.on('view:filter', toggleFilter)
  rpc.on('view:toggle-mobile', toggleRequestMobile)
  rpc.on('view:toggle-devtools', () => {
    console.log(webview)
    if (webview.isDevToolsOpened()) webview.closeDevTools()
    else webview.openDevTools()
  })
  rpc.on('camera:request-save-screenshot', () => {
    rpc.emit('camera:save-screenshot', [webview.getURL(), webview.getTitle()])
  })
  rpc.on('recorder:start', () => {
    el.classList.add('recording')
  })
  rpc.on('recorder:end', () => {
    el.classList.remove('recording')
  })

  window.addEventListener('resize', resize)
}

function load (url) {
  status.unFreeze()

  rpc.emit('status:log', {
    'body': '•••',
    'type': 'loading'
  })

  rpc.emit('omnibox:hide')

  webview.classList.add('show')
  webview.setAttribute('src', url)
}

function resize () {
  frame.style.width = window.innerWidth + 'px'
  frame.style.height = (window.innerHeight - document.querySelector('handle').offsetHeight) + 'px'
}

function onLoadCommit (e) {
  if (isFirstLoad) {
    isFirstLoad = false
    rpc.emit('view:first-load')
    menus.refresh()
  }
  rpc.emit('status:log', {
    'body': '•••',
    'type': 'loading'
  })
  console.log('[view]', 'load-commit', e)
}

function reload () {
  webview.reload()
}

function reloadIgnoringCache () {
  webview.reloadIgnoringCache()
}

function navigateBack () {
  if (webview.canGoBack()) webview.goBack()
}

function navigateForward () {
  if (webview.canGoForward()) webview.goForward()
}

function zoomIn () {
  zoomIndex++
  if (zoomIndex >= zoomIncrements.length) zoomIndex = zoomIncrements.length - 1
  webview.setZoomFactor(zoomIncrements[zoomIndex])
  rpc.emit('status:log', {
    body: Math.round(zoomIncrements[zoomIndex] * 100) + '%'
  })
}

function zoomOut () {
  zoomIndex--
  if (zoomIndex < 0) zoomIndex = 0
  webview.setZoomFactor(zoomIncrements[zoomIndex])
  rpc.emit('status:log', {
    body: Math.round(zoomIncrements[zoomIndex] * 100) + '%'
  })
}

function resetZoom () {
  zoomIndex = 6
  webview.setZoomFactor(zoomIncrements[zoomIndex])
  rpc.emit('status:log', {
    body: Math.round(zoomIncrements[zoomIndex] * 100) + '%'
  })
}

function toggleFilter (filter) {
  webview.classList.toggle(filter)

  rpc.emit('status:log', {
    body: filter.charAt(0).toUpperCase() + filter.substr(1).toLowerCase()
  })

  if (filter === 'invert') {
    // invert handle color them as well
    rpc.emit('theme:toggle')
  }
}

// use this when updating the app to get the most recent UA
function getDefaultUserAgent () {
  console.log(webview.getUserAgent())
}

function toggleRequestMobile () {
  const userAgentActive = requestMobileSiteActive ? userAgentDefault : userAgentMobile
  requestMobileSiteActive = !requestMobileSiteActive
  webview.getWebContents().session.setUserAgent(userAgentActive)
  webview.setUserAgent(userAgentActive)
  webview.setAttribute('useragent', requestMobileSiteActive)
  rpc.emit('view:toggle-mobile-updated', requestMobileSiteActive)
  reload()
}

function onCrashed (e) {
  console.log('[view] Crashed: ', e)
  rpc.emit('status:error', {
    body: 'View crashed'
  })
}

function onDidFailLoad (e) {
  isFirstLoad = false
  rpc.emit('view:first-load')
  rpc.emit('view:title-updated', 'Ōryōki')
  menus.refresh()

  // ignore these
  if (e.errorCode === -3) return

  switch (e.errorCode) {
    case -105:
      rpc.emit('status:error', {
        body: 'Server DNS address could not be found'
      })
      rpc.emit('omnibox:show')
      break
    case -102:
      rpc.emit('status:error', {
        body: 'Host refused to connect'
      })
      rpc.emit('omnibox:show')
      break
    default:
      rpc.emit('status:error', {
        body: 'Load failed'
      })
  }
}

module.exports = {
  init: init,
  load: load
}

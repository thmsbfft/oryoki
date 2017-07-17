const {remote, ipcRenderer} = require('electron')
const config = remote.require('./config')
const rpc = require('../utils/rpc')

let el = null
let webview = null

// utils
let isFirstLoad = true
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

function setup() {
  el = document.querySelector('#view')

  webview = el.appendChild(document.createElement('webview'))
  webview.className = 'webview'

  var webPreferences = 'experimentalFeatures=yes, experimentalCanvasFeatures=yes'
  webview.setAttribute('webPreferences', webPreferences)

  console.log('[view] ✔')
  attachEvents()
}

function attachEvents () {
  // Loading Events
  webview.addEventListener('load-commit', onLoadCommit)
  // webview.addEventListener('did-frame-finish-load', onDidFrameFinishLoad)
  // webview.addEventListener('did-finish-load', onDidFinishLoad)
  // webview.addEventListener('did-fail-load', onDidFailLoad)
  // webview.addEventListener('did-get-response-details', onDidGetResponseDetails)
  // webview.addEventListener('dom-ready', onDOMReady)
}

function load (url) {
  webview.classList.add('show')
  webview.setAttribute('src', url)
  rpc.emit('load-request', url)
}

function onLoadCommit (e) {
  if (isFirstLoad) isFirstLoad = false
  console.log('[view]', 'load-commit', e)
}

module.exports = {
  setup: setup,
  load: load
}
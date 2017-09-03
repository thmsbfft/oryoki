const rpc = require('../utils/rpc')

let el = null

// utils
let isActive = false
let isFrozen = false

let visibilityTimer = null

function init () {
  el = document.querySelector('status')

  rpc.on('status:log', log)
  rpc.on('status:important', important)
  rpc.on('status:error', error)
  rpc.on('status:unfreeze', unFreeze)
  rpc.on('status:hide', hide)
  rpc.on('status:show', show)
  rpc.on('status:url-hover', onURLHover)
  rpc.on('status:url-out', onURLOut)
}

function log (props) {
  // loading events have lower priority
  if (props.type === 'loading' && isActive) return

  // stop logging stuff if an error is displayed
  if (isFrozen) return

  if (props.icon) {
    el.innerHTML = '<icon>' + props.icon + '</icon>' + props.body
  } else {
    el.innerHTML = props.body
  }

  isActive = true

  el.classList.remove('fade-out')
  el.classList.add('fade-in')

  clearTimeout(visibilityTimer)
  visibilityTimer = setTimeout(fadeOut, 1200)
}

function important (props) {
  if (props.icon) {
    el.innerHTML = '<icon>' + props.icon + '</icon>' + props.body
  } else {
    el.innerHTML = props.body
  }

  isActive = true

  el.classList.remove('fade-out')
  el.classList.add('fade-in')

  freeze()
}

function error (props) {
  el.innerHTML = '<icon>' + '⚡️' + '</icon>' + props.body
  el.classList.remove('fade-out')
  el.classList.add('fade-in')

  isActive = true

  freeze()
}

function onURLHover (url) {
  if (url.length > 35) {
    url = url.substring(0, 35) + '...'
  }
  el.innerHTML = url
  isActive = true
  el.classList.remove('fade-out')
  el.classList.add('fade-in')
  clearTimeout(visibilityTimer)
}

function onURLOut () {
  if(isFrozen) return
  visibilityTimer = setTimeout(fadeOut, 100)
}

function freeze () {
  clearTimeout(visibilityTimer)
  isFrozen = true
}

function unFreeze () {
  if (isFrozen) {
    visibilityTimer = setTimeout(fadeOut, 1200)
    isFrozen = false
  }
}

function fadeOut () {
  el.classList.add('fade-out')
  isActive = false
}

function hide () {
  el.innerHTML = ''
  el.classList.add('hide')
  freeze()
}

function show () {
  el.classList.remove('hide')
  unFreeze()
}

module.exports = {
  init,
  unFreeze
}

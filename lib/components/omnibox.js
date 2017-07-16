const {remote, ipcRenderer} = require('electron')

const config = remote.require('./config')
const updater = remote.require('./updater')
const rpc = require('../utils/rpc')

const hints = require('./hints')

// Elements
let el
let input
let overlay
let updateHint

// Data
let searchDictionary = config.getSearchDictionary()

// Utils
var isShown = false
var dragCount = 0

function init () {
  el = document.querySelector('omnibox')
  input = el.querySelector('.input')
  overlay = el.querySelector('.overlay')
  updateHint = el.querySelector('.updateHint')

  // Events
  input.addEventListener('keydown', onKeyDown)
  input.addEventListener('keyup', onKeyUp)

  // Always keep the omnibox in focus
  overlay.addEventListener('mousedown', (e) => {
    focus()
    e.preventDefault()
  })

  // Check on updater
  refreshUpdaterStatus()
  ipcRenderer.on('updater-refresh', refreshUpdaterStatus)

  hints.setup()
  show()
  console.log('[omnibox] ✔')
}

function onKeyDown (e) {
  if(e.keyCode == 40 || e.keyCode == 38) return
  if(e.keyCode == 13) {
    input.classList.add('highlight')
    e.preventDefault()
  }
}

function onKeyUp (e) {
  if(e.keyCode == 40 || e.keyCode == 38) return
    
  if(e.keyCode == 13) {
    input.classList.remove('highlight')
    submit()
    e.preventDefault()
    return
  }

  var customSearch = getCustomSearch()

  if (customSearch != null) {
    input.classList.add('hintShown')
    hints.show(input.value, customSearch)
  } else {
    hints.hide()
  }
}

function submit () {
  var raw = input.value
  var output = null

  var domain = new RegExp(/[a-z]+(\.[a-z]+)+/ig)
  var port = new RegExp(/(:[0-9]*)\w/g)

  var customSearch = getCustomSearch()

  if (customSearch == null || customSearch[0].isComplete == undefined) {
    // Is this a domain?
    if (domain.test(raw) || port.test(raw)) {
      if (!raw.match(/^[a-zA-Z]+:\/\//)) {
        output = 'http://' + raw
      } else {
        output = raw
      }
    } else {
      // Use default search engine
      output = searchDictionary.default.replace('{query}', raw)
    }
  } else if (customSearch[0].isComplete) {
    // Use custom search
    var keyword = customSearch[0].keyword
    var query = raw.replace(keyword, '')

    if (query.trim().length == 0) {
      // If custom search doesn't have a parameter,
      // use default URL
      output = searchDictionary.default.replace('{query}', raw)
    } else {
      console.log('[omnibox] Search URL:', customSearch[0].url)
      output = customSearch[0].url.replace('{query}', query.trim())
    }
  }

  // this.submitCallback(output)
  console.log('[omnibox]  ⃯⃗→ ', output)
}

function show () {
  isVisible = true

  focus()
  selectAll()
}

function hide () {
  isVisible = false
}

function focus () {
  input.focus()
}

function selectAll () {
  focus()
  document.execCommand('selectAll', false, null)
}

function updateSearchDictionary () {
  searchDictionary = config.getSearchDictionary()
}

function getCustomSearch () {
  var raw = input.value
  var keyword = raw.split(' ')[0].trim()

  // Empty omnibox doesn't count
  if (keyword.trim().length == 0) return null

  // Look for a complete match
  var completeMatch = searchDictionary.custom.filter(function (search) {
    return search.keyword == keyword
  })

  if (completeMatch.length > 0) {
    console.log('[omnibox] Complete match:', completeMatch[0].keyword)
    completeMatch[0].isComplete = true // Flag the match as a complete match
    return completeMatch
  }

  // Look for potential matches
  var potentialMatches = searchDictionary.custom.filter(function (search) {
    return search.keyword.includes(keyword)
  })

  console.log('[omnibox] Potential matches:', potentialMatches.length)

  if (potentialMatches.length == 0) {
    // No matches
    return null
  } else {
    return potentialMatches
  }
}

function refreshUpdaterStatus () {
  switch(updater.getStatus()) {
    case 'no-update':
      return

    case 'update-available':
      updateHint.innerHTML = 'Update available (' + updater.getLatest().version + ')'
      updateHint.className = 'updateClue available'
      updateHint.addEventListener('click', requestDownloadUpdate)
      break

    case 'downloading-update':
      updateHint.removeEventListener('click', requestDownloadUpdate)
      updateHint.innerHTML = 'Downloading'
      updateHint.className = 'updateClue downloading'
      break

    case 'update-ready':
      updateHint.innerHTML = 'Update to ' + updater.getLatest().version
      updateHint.className = 'updateClue ready'
      updateHint.addEventListener('click', () => {
        updater.quitAndInstall()
      })
      break
  }
}

function requestDownloadUpdate () {
  updater.downloadUpdate()
}

module.exports = {
  init: init
}
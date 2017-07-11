const {remote, ipcRenderer} = require('electron')

const config = remote.require('./config')
const rpc = require('../utils/rpc')

// Elements
let el
let input
let hints
let overlay
let updateHint

// Data
let searchDictionary

// Utils
var isShown = false
var dragCount = 0

function init () {
  el = document.querySelector('omnibox')
  input = el.querySelector('.input')
  hints = el.querySelector('.hints')
  overlay = el.querySelector('.overlay')
  updateHint = el.querySelector('.updateHint')


  console.log('[omnibox] ✔')
}

module.exports = {
  init: init
}
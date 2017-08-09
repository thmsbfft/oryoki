const path = require('path')
const {BrowserWindow} = require('electron')

let win
let ready
let buffer = []

function init () {
  win = new BrowserWindow({show: false})
  win.loadURL(path.join('file://', __dirname, '/notify.html'))
  win.webContents.on('dom-ready', () => {
    ready = true
    buffer.forEach(([title, props]) => {
      send(title, props)
    })
    buffer = null
  })
}

function send (title, props) {
  if (ready) {
    win.webContents.send('notification', title, props)
  } else {
    buffer.push([title, props])
  }
}

module.exports = {
  init,
  send
}

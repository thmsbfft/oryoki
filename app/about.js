const path = require('path')
const {BrowserWindow, ipcMain} = require('electron')

var bw = null

function init () {
  bw = new BrowserWindow({
    show: false,
    width: 350,
    height: 400,
    center: true,
    title: 'Ōryōki',
    backgroundColor: '#333333',
    frame: false,
    resizable: false,
    acceptFirstMouse: true
  })
  bw.loadURL('file://' + path.join(__dirname, 'about.html'))

  bw.on('close', function (e) {
    e.preventDefault()
    this.hide()
  }.bind(this))

  ipcMain.on('hide-about', function () {
    this.hide()
  }.bind(this))

  console.log('[about] ✔')
}

function show () {
  bw.webContents.send('show-about')
  bw.show()
  bw.focus()
}

function hide () {
  bw.hide()
}

module.exports = {
  init: init,
  show: show,
  hide: hide
}
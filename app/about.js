const path = require('path')
const {BrowserWindow, ipcMain, app} = require('electron')

let win

function init () {
  win = new BrowserWindow({
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
  win.loadURL('file://' + path.join(__dirname, 'about.html'))

  win.on('close', function (e) {
    e.preventDefault()
    hide()
  })

  ipcMain.on('hide-about', function () {
    hide()
  })

  app.on('before-quit', () => {
    close()
  })

  console.log('[about] ✔')
}

function show () {
  win.webContents.send('show-about')
  win.show()
  win.focus()
}

function hide () {
  win.hide()
}

function close () {
  win.removeAllListeners('close')
  win.close()
}

module.exports = {
  init: init,
  show: show,
  hide: hide
}

const {BrowserWindow} = require('electron')

let win;
let ready;
let buffer = [];

function init () {
  win = new BrowserWindow({show: false})
  win.loadURL('file://' + __dirname + '/notify.html')
  win.webContents.on('dom-ready', () => {
    ready = true
    buffer.forEach(([title, props]) => {
      send(title, props);
    })
    buffer = null
  })
}

function send (title, props) {
  win.webContents.openDevTools();
  if(ready) {
    console.log('send')
    win.webContents.send('notification', title, props)
  }
  else {
    console.log('storing')
    buffer.push([title, props])
  }
}

module.exports = {
  init: init,
  send: send
}

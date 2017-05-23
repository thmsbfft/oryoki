const {BrowserWindow} = require('electron')

module.exports = class Notification {
  constructor (title, props) {
    this.title = title
    this.props = props

    this.bw = new BrowserWindow({show: false})
    this.bw.loadURL('file://' + __dirname + '/notification.html')

    this.bw.webContents.on('dom-ready', () => {
      // this.bw.webContents.openDevTools();
      this.bw.webContents.send('notify', this.title, this.props)
    })
  }
}

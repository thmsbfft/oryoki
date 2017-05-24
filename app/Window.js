const {BrowserWindow} = require('electron')
const config = require('./config')

module.exports = class Window {
  constructor (id, width, height) {
    this.id = id
    console.log('[Window] ' + this.id)

    this.browser = new BrowserWindow({
      width: width,
      height: height,
      frame: true,
      backgroundColor: '#141414',
      show: false,
      minWidth: 200,
      minHeight: 200,
      darkTheme: true,
      webPreferences: {
        'experimentalFeatures': true,
        'experimentalCanvasFeatures': true
      },
      fullscreenable: !config.getPreference('picture_in_picture')
    })

    this.browser.loadURL('file://' + __dirname + '/window.html' + '#' + this.id)
  
    this.browser.on('focus', () => {
      // console.log(this)
    })

    this.browser.once('ready-to-show', () => {
      this.browser.show()
    })

    this.browser.webContents.openDevTools()
  }

}
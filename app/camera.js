const fs = require('fs')
const URL = require('url')

const extract = require('png-chunks-extract')
const encode = require('png-chunks-encode')
const text = require('png-chunk-text')

const {timestamp} = require('./utils')
const {app, BrowserWindow, clipboard} = require('electron')

const config = require('./config')

function init () {
  console.log('[camera] ✔')
}

function requestSaveScreenshot (win) {
  win.rpc.emit('camera:request-save-screenshot')
  // view will return the ping along with some data on current page
  win.rpc.on('camera:save-screenshot', saveScreenshot)
}

function saveScreenshot (data) {
  const win = BrowserWindow.getFocusedWindow()
  win.rpc.emit('status:hide')

  setTimeout(() => {
    win.capturePage((image) => {
      let url = data[0]
      let title = data[1]
      let hostname = URL.parse(url).hostname
      let stamp = timestamp()

      // check path
      let path = config.getPreference('screenshots_save_path')
      if (path === '') {
        path = app.getPath('downloads')
      } else {
        try {
          fs.statSync(path)
        } catch (err) {
          win.rpc.emit('status:error', {
            body: 'Could not save to \'' + path + '\''
          })
          return
        }
      }

      if (hostname == null) {
        // no url
        let name = 'oryoki-' + stamp
        fs.writeFile(path + '/' + name + '.png', image.toPng(), (err) => {
          if (err) throw err
          win.rpc.emit('status:show')
          win.rpc.emit('status:unfreeze')
          win.rpc.emit('status:log', {
            body: 'Screenshot saved'
          })
        })
      } else {
        // url is here
        let name = 'o-' + hostname + '-' + stamp

        // encode url to png metadata
        let buffer = image.toPng()
        let chunks = extract(buffer)

        chunks.splice(-1, 0, text.encode('title', Buffer.from(title).toString('base64')))
        chunks.splice(-1, 0, text.encode('src', url))

        fs.writeFile(path + '/' + name + '.png', Buffer.from(encode(chunks)), (err) => {
          if (err) throw err
          win.rpc.emit('status:show')
          win.rpc.emit('status:unfreeze')
          win.rpc.emit('status:log', {
            body: 'Screenshot saved'
          })
        })
      }
    })
  }, 200)

  console.log('[camera] Saving:', data[0], data[1])
}

function copyScreenshot (win) {
  if (!win) win = BrowserWindow.getFocusedWindow()

  win.rpc.emit('status:hide')

  setTimeout(() => {
    win.capturePage((image) => {
      clipboard.writeImage(image)
      win.rpc.emit('status:show')
      win.rpc.emit('status:unfreeze')
      win.rpc.emit('status:log', {
        body: 'Screenshot copied to clipboard'
      })
    })
  }, 200)
}

module.exports = {
  init,
  requestSaveScreenshot,
  copyScreenshot
}

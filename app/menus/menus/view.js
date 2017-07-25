const {BrowserWindow} = require('electron')

module.exports = function () {

  const win = BrowserWindow.getFocusedWindow()
  var isFirstLoad = true
  if (win !== null) isFirstLoad = win.isFirstLoad

  const submenu = [
      {
        label: 'Title Bar',
        accelerator: 'CmdOrCtrl+/',
        type: 'checkbox',
        click (i, win) {
          win.rpc.emit('handle:toggle')
        }
      },
      {
        label: 'Toggle Omnibox',
        accelerator: 'CmdOrCtrl+L',
        enabled: !isFirstLoad,
        click: function (i, win) {
          win.rpc.emit('omnibox:toggle')
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      },
      {
        type: 'separator'
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        enabled: !isFirstLoad,
        click (i, win) {
          win.rpc.emit('view:reload')
        }
      },
      {
        label: 'Hard Reload',
        accelerator: 'CmdOrCtrl+Shift+R',
        enabled: !isFirstLoad,
        click (i, win) {
          win.rpc.emit('view:hard-reload')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Navigate Back',
        accelerator: 'CmdOrCtrl+[',
        enabled: !isFirstLoad,
        click (i, win) {
          win.rpc.emit('view:navigate-back')
        }
      },
      {
        label: 'Navigate Forward',
        accelerator: 'CmdOrCtrl+]',
        enabled: !isFirstLoad,
        click (i, win) {
          win.rpc.emit('view:navigate-forward')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Actual Size',
        accelerator: 'CmdOrCtrl+0',
        click (i, win) {
          win.rpc.emit('view:reset-zoom')
        }
      },
      {
        label: 'Zoom In',
        accelerator: 'CmdOrCtrl+Plus',
        click (i, win) {
          win.rpc.emit('view:zoom-in')
        }
      },
      {
        label: 'Zoom Out',
        accelerator: 'CmdOrCtrl+-',
        click (i, win) {
          win.rpc.emit('view:zoom-out')
        }
      }
  ]

  return {
    label: 'View',
    submenu
  }
}
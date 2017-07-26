const windows = require('./../../windows')

module.exports = function () {
  let win = windows.getFocused()

  let isAlwaysOnTop = false
  if (win !== null) isAlwaysOnTop = win.isAlwaysOnTop()

  const submenu = [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize' // Also adds Minimize All
      },
      {
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Float on Top',
        type: 'checkbox',
        checked: isAlwaysOnTop,
        enabled: !(win == null),
        click: function (i, win) {
          win.setAlwaysOnTop(!win.isAlwaysOnTop())
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle Window Helper',
        accelerator: 'CmdOrCtrl+Alt+M',
        type: 'checkbox',
        enabled: !(win == null),
        click (i, win) {
          win.rpc.emit('windowhelper:toggle')
        }
      },
      {
        label: 'Size',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Cycle Through Windows',
        accelerator: 'Ctrl+Tab',
        enabled: !(win == null),
        click () {
          windows.cycle()
        }
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      },
      {
        type: 'separator'
      }
  ]

  return {
    label: 'Window',
    role: 'window',
    submenu
  }
}
const config = require('./../../config')
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

  // defined by user preferences
  let windowSizes = config.getPreference('window_sizes')
  for (var i in windowSizes) {
    let name = windowSizes[i]
    let dimensions = windowSizes[i].split('x')
    let index = parseInt(Object.keys(windowSizes).indexOf(i)) + 1

    // menu: Window > Size
    submenu[6].submenu.push(
      {
        label: name,
        accelerator: 'CmdOrCtrl+' + index,
        click (i, win) {
          windows.resize(dimensions[0], dimensions[1])
          win.rpc.emit('status:log', {
            'body': dimensions[0] + 'x' + dimensions[1]
          })
        }
      }
    )
  }

  return {
    label: 'Window',
    role: 'window',
    submenu
  }
}
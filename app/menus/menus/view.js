const {app, shell} = require('electron')
const config = require('./../../config')
const windows = require('./../../windows')

module.exports = function () {
  let win = windows.getFocused()

  let isFirstLoad = true
  if (win !== null) isFirstLoad = win.isFirstLoad

  let hasTitleBar = config.getPreference('show_title_bar')
  if (win !== null) hasTitleBar = win.hasTitleBar

  let darkTheme = true
  if (win !== null) darkTheme = win.darkTheme

  let isFullScreen = false
  if (win !== null) isFullScreen = win.isFullScreen()

  const submenu = [
    {
      label: 'Title Bar',
      accelerator: 'CmdOrCtrl+/',
      type: 'checkbox',
      checked: hasTitleBar,
      enabled: !(win == null),
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('handle:toggle')
      }
    },
    {
      label: 'Toggle Omnibox',
      accelerator: 'CmdOrCtrl+L',
      enabled: !isFirstLoad,
      click: function (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('omnibox:toggle')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Full Screen',
      accelerator: 'Cmd+Ctrl+F',
      type: 'checkbox',
      checked: isFullScreen,
      click (i, win) {
        windows.toggleFullScreen()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      enabled: !isFirstLoad,
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:reload')
      }
    },
    {
      label: 'Hard Reload',
      accelerator: 'CmdOrCtrl+Shift+R',
      enabled: !isFirstLoad,
      click (i, win) {
        if (win == null) win = windows.getFocused()
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
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:navigate-back')
      }
    },
    {
      label: 'Navigate Forward',
      accelerator: 'CmdOrCtrl+]',
      enabled: !isFirstLoad,
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:navigate-forward')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Actual Size',
      accelerator: 'CmdOrCtrl+0',
      enabled: !isFirstLoad,
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:reset-zoom')
      }
    },
    {
      label: 'Zoom In',
      accelerator: 'CmdOrCtrl+Plus',
      enabled: !isFirstLoad,
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:zoom-in')
      }
    },
    {
      label: 'Zoom Out',
      accelerator: 'CmdOrCtrl+-',
      enabled: !isFirstLoad,
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:zoom-out')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Night Mode',
      accelerator: 'Ctrl+Cmd+N',
      type: 'checkbox',
      checked: darkTheme,
      click () {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('theme:toggle')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Invert',
      accelerator: 'CmdOrCtrl+I',
      enabled: !isFirstLoad,
      type: 'checkbox',
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:filter', 'invert')
      }
    },
    {
      label: 'Grayscale',
      accelerator: 'CmdOrCtrl+G',
      enabled: !isFirstLoad,
      type: 'checkbox',
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:filter', 'grayscale')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Downloads',
      click () {
        shell.openItem(app.getPath('downloads'))
      }
    }
  ]

  return {
    label: 'View',
    submenu
  }
}

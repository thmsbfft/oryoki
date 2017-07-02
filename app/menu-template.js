const {app} = require('electron')
const updater = require('./updater')

const about = require('./about')
const windows = require('./windows')

module.exports = function () {
  var name = app.getName()
  var version = app.getVersion()

  // Special cases
  var latestVersion = updater.getLatest()
  var updaterStatus = updater.getStatus()
  var updaterMenu = ({
    'update-available': {
      label: 'Download Update',
      click: function () {
        updater.downloadUpdate()
      },
      enabled: true
    },
    'downloading-update': {
      label: 'Downloading Update...',
      click: '',
      enabled: false
    },
    'no-update': {
      label: 'Check for Update',
      click: function () {
        updater.checkForUpdate(true)
      },
      enabled: true
    },
    'update-ready': {
      label: latestVersion ? 'Update to ' + latestVersion.version : 'Quit and Install',
      click: function () {
        updater.quitAndInstall()
      },
      enabled: true
    }
  })[updaterStatus]

  const appMenu = {
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        click: function () {
          about.show()
        }
      },
      {
        label: 'Version ' + version,
        enabled: false
      },
      {
        label: updaterMenu.label,
        click: updaterMenu.click,
        enabled: updaterMenu.enabled
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  }

  const fileMenu = {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
          // if (Oryoki) Oryoki.openFile()
        }
      },
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+N',
        click: function () {
          windows.create()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Close Window',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      }
    ]
  }

  const editMenu = {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }
    ]
  }

  const viewMenu = {
    label: 'View',
    submenu: [
      {
        label: 'Title Bar',
        accelerator: 'CmdOrCtrl+/',
        type: 'checkbox',
        click: function () {
        
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  }

  const windowMenu = {
    label: 'Window',
    role: 'window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize' // Also adds Minimize All
      },
      {
        type: 'separator'
      },
      {
        label: 'Float on Top',
        type: 'checkbox',
        click: function (item, win) {
          if (win) {
            // console.log(win.id)
          }
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Window Helper',
        accelerator: 'CmdOrCtrl+Alt+M',
        type: 'checkbox',
        click: function () {
          // if (windows.focused) {
          //   Oryoki.focusedWindow.toggleWindowHelper()
          // }
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
        // accelerator: 'CmdOrCtrl+`',
        click: function () {
          // if (Oryoki) {
          //   Oryoki.focusNextWindow()
          // }
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
  }

  const template = [
    appMenu,
    fileMenu,
    viewMenu,
    editMenu,
    windowMenu
  ]

  return template
}
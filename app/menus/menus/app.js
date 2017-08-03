const {app} = require('electron')

const name = app.getName()
const version = app.getVersion()

const updater = require('./../../updater')
const about = require('./../../about')
const config = require('./../../config')

module.exports = function () {
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
      label: 'Check for Updates...',
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

  const submenu = [
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
        label: 'Preferences...',
        accelerator: 'CmdOrCtrl+,',
        click () {
          config.openFile('oryoki-preferences.json')
        }
      },
      {
        label: 'Search Dictionary...',
        click () {
          config.openFile('search-dictionary.json')
        }
      },
      {
        label: 'Browse all Data...',
        click () {
          config.openPath()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Reset',
        submenu: [
          {
            label: 'Preferences',
            click () {
              config.reset('Preferences', 'oryoki-preferences.json')
            }
          },
          {
            label: 'Search Dictionary',
            click () {
              config.reset('Search dictionary', 'search-dictionary.json')
            }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: 'Clear Caches',
        click () {
          config.clearCaches()
        }
      },
      { 
        label: 'Clear Local Storage',
        click () {
          config.clearLocalStorage()
        }
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

  return {
    label: name,
    submenu
  }
}
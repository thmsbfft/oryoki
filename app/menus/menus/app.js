const {app} = require('electron')

const name = app.getName()
const version = app.getVersion()

const updater = require('./../../updater')
const about = require('./../../about')

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
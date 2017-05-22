const {app} = require('electron')
const updater = require('./updater')

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
        // Updater.downloadUpdate()
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
        // Updater.quitAndInstall()
      },
      enabled: true
    }
  })[updaterStatus]

  var template = [
    {
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          click: function () {
            // About.show()
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
      ]
    }
  ]

  return template
}()
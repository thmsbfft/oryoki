const os = require('os')
const {app} = require('electron')
const windows = require('./../../windows')

module.exports = function () {
  const submenu = [
    {
      label: 'Documentation',
      click () {
        windows.create('http://oryoki.io/')
      }
    },
    {
      label: 'Report Issue',
      click () {
        let body = '<!-- Please succinctly describe your issue and steps to reproduce it. -->\n\n'
        body += app.getName() + ' ' + app.getVersion() + '\n'
        body += 'Electron ' + process.versions.electron + '\n'
        body += process.platform + ' ' + process.arch + ' ' + os.release()

        windows.create('https://github.com/thmsbfft/oryoki/issues/new?body=' + encodeURIComponent(body))
      }
    }
  ]

  return {
    label: 'Help',
    role: 'help',
    submenu
  }
}

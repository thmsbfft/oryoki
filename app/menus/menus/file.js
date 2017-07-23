const windows = require('./../../windows')

module.exports = function () {
  const submenu = [
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

  return {
    label: 'File',
    submenu
  }
}
module.exports = function () {
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
        click: function (i, win) {
          win.rpc.emit('omnibox:toggle')
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
  ]

  return {
    label: 'View',
    submenu
  }
}
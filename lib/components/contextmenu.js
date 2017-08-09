const {remote} = require('electron')
const Menu = remote.Menu

function open (e) {
  e.preventDefault()
  const webview = e.target

  const template = [
    {
      label: 'Back',
      enabled: webview.canGoBack(),
      click () {
        webview.goBack()
      }
    },
    {
      label: 'Forward',
      enabled: webview.canGoForward(),
      click () {
        webview.goForward()
      }
    },
    {
      label: 'Reload',
      click () {
        webview.reload()
      }
    },
    {
      type: 'separator'
    },
    {
      role: 'copy'
    },
    {
      type: 'separator'
    },
    {
      label: 'Inspect Element',
      click () {
        webview.inspectElement(e.x, e.y)
      }
    }
  ]

  let menu = Menu.buildFromTemplate(template)
  menu.popup(remote.getCurrentWindow(), {
    async: true
  })
}

module.exports = {
  open
}

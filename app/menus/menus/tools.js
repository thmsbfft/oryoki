const {BrowserWindow} = require('electron')
const windows = require('./../../windows')
const camera = require('./../../camera')
const recorder = require('./../../recorder')

module.exports = function () {
  let win = windows.getFocused()
  const recorderStatus = recorder.getStatus()

  let isFirstLoad = true
  if (win !== null) isFirstLoad = win.isFirstLoad

  let hasConsole = false
  if (win !== null) hasConsole = win.hasConsole

  let isRequestMobile = false
  if (win !== null) isRequestMobile = win.isRequestMobile

  const submenu = [
    {
      label: 'Save Screenshot',
      accelerator: 'CmdOrCtrl+~',
      enabled: !(win == null),
      click (i, win) {
        if (win == null) win = windows.getFocused()
        camera.requestSaveScreenshot(win)
      }
    },
    {
      label: 'Copy Screenshot',
      accelerator: 'CmdOrCtrl+Shift+C',
      enabled: !(win == null),
      click (i, win) {
        if (win == null) win = windows.getFocused()
        if (win !== null) camera.copyScreenshot(win)
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Start Recording',
      enabled: recorderStatus === 'idle' && !(win == null),
      accelerator: 'CmdOrCtrl+Shift+P',
      click (i, win) {
        if (win == null) win = windows.getFocused()
        recorder.startRecording(win)
      }
    },
    {
      label: 'Stop Recording',
      enabled: recorderStatus === 'recording' && !(win == null),
      accelerator: 'CmdOrCtrl+Alt+Shift+P',
      click () {
        recorder.stopRecording()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Mini Console',
      accelerator: 'CmdOrCtrl+Alt+C',
      type: 'checkbox',
      checked: hasConsole,
      enabled: !isFirstLoad,
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('console:toggle')
      }
    },
    {
      label: 'Toggle Devtools',
      enabled: !isFirstLoad,
      accelerator: 'CmdOrCtrl+Alt+I',
      click (i, win) {
        if (win == null) win = windows.getFocused()
        win.rpc.emit('view:toggle-devtools')
      }
    },
    {
      label: 'Request Mobile Site',
      accelerator: 'CmdOrCtrl+Alt+U',
      type: 'checkbox',
      checked: isRequestMobile,
      enabled: !isFirstLoad,
      click (i, win) {
        BrowserWindow.getAllWindows().forEach((win) => {
          // broadcast change accross all windows
          try { win.rpc.emit('view:toggle-mobile') } catch (err) {}
        })
      }
    }
  ]

  return {
    label: 'Tools',
    submenu
  }
}

const windows = require('./../../windows')
const camera = require('./../../camera')
const recorder = require('./../../recorder')

module.exports = function () {
  let win = windows.getFocused()
  const recorderStatus = recorder.getStatus()

  let isFirstLoad = true
  if(win !== null) isFirstLoad = win.isFirstLoad

  let hasConsole = false
  if(win !== null) {
    hasConsole = win.hasConsole
    console.log(win.hasConsole)
  }

  const submenu = [
    {
      label: 'Save Screenshot',
      accelerator: 'CmdOrCtrl+`',
      enabled: !(win == null),
      click (i, win) {
        camera.requestSaveScreenshot(win)
      }
    },
    {
      label: 'Copy Screenshot',
      accelerator: 'CmdOrCtrl+Shift+C',
      enabled: !(win == null),
      click (i, win) {
        camera.copyScreenshot(win)
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Start Recording',
      enabled: recorderStatus == 'idle' && !(win == null),
      accelerator: 'CmdOrCtrl+Shift+P',
      click (i, win) {
        recorder.startRecording(win)
      }
    },
    {
      label: 'Stop Recording',
      enabled: recorderStatus == 'recording' && !(win == null),
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
        win.rpc.emit('console:toggle')
      }
    },
    {
      label: 'Toggle Devtools',
      enabled: !isFirstLoad,
      accelerator: 'CmdOrCtrl+Alt+I',
      click (i, win) {
        win.rpc.emit('view:toggle-devtools')
      }
    }
  ]

  return {
    label: 'Tools',
    submenu
  }
}
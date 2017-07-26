const windows = require('./../../windows')
const camera = require('./../../camera')
const recorder = require('./../../recorder')

module.exports = function () {
  let win = windows.getFocused()
  const recorderStatus = recorder.getStatus()

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
    }
  ]

  return {
    label: 'Tools',
    submenu
  }
}
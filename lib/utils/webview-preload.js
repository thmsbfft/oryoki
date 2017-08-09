window.addEventListener('load', function () {
  let backgroundColor = window.getComputedStyle(document.querySelector('body')).backgroundColor
  backgroundColor = backgroundColor.substring(backgroundColor.lastIndexOf('(') + 1, backgroundColor.lastIndexOf(')')).split(', ')

  let data = {
    backgroundColor: backgroundColor
  }

  require('electron').ipcRenderer.sendToHost('webview:data', data)
})

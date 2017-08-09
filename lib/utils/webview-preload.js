window.addEventListener('load', function () {
  backgroundColor = window.getComputedStyle(document.querySelector('body')).backgroundColor
  backgroundColor = backgroundColor.substring(backgroundColor.lastIndexOf('(') + 1, backgroundColor.lastIndexOf(')')).split(', ')

  var data = {
    backgroundColor: backgroundColor
  }

  require('electron').ipcRenderer.sendToHost('webview:data', data)
})

var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('ready', function() {
	console.log('Ready!');

	omnibox = new Omnibox();

})
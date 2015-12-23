var ipcRenderer = require('electron').ipcRenderer;
var fs = require('fs');
var path = require('path');

ipcRenderer.on('ready', function() {
	console.log('Ready!');

	omnibox = new Omnibox({
		'mode' : 'url'
	});

})
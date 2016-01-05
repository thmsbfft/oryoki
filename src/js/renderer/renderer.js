'use strict';
var ipcRenderer = require('electron').ipcRenderer;
var fs = require('fs');
var path = require('path');
var conf = {
	'chromeVersion' : process.versions.chrome,
	'electronVersion' : process.versions.electron
};

ipcRenderer.on('ready', function() {
	
	console.log('Ready!');
	Browser = new Browser();

})
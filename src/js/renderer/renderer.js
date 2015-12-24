'use strict';
var ipcRenderer = require('electron').ipcRenderer;
var fs = require('fs');
var path = require('path');
var browser = undefined;

ipcRenderer.on('ready', function() {
	
	console.log('Ready!');
	browser = new Browser();

})
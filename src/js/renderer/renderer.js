'use strict';
var ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const clipboard = remote.clipboard;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

var fs = require('fs');
var os = require('os');
var path = require('path');

var conf = {
	'chromeVersion' : process.versions.chrome,
	'electronVersion' : process.versions.electron
};

ipcRenderer.on('ready', function() {
	
	console.log('[IPC] ☑️');
	Browser = new Browser();
	StatusManager = new StatusManager({

	});

})
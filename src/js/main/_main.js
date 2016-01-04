function pad(n) { return ("0" + n).slice(-2); }

var Console = require('console').Console;
var fs = require('fs');
var output = fs.createWriteStream('./stdout.log');
var c = new Console(output);

var hrs = pad(new Date().getHours());
var min = pad(new Date().getMinutes());
var sec = pad(new Date().getSeconds());
var time = hrs + ':' + min + ':' + sec;

c.log('');
c.log('--------');
c.log(time);
c.log('--------');
c.log('');
function Command(options) {

	this.id = options.id;
	this.accelerator = options.accelerator;
	this.callback = options.callback;

}
function CommandManager() {
	this.register = {};
	c.log('CommandManager!');
}

CommandManager.prototype.registerCommand = function(scope, windowId, command) {

	if(scope == 'global') {
		if(!this.register[command.id]) {
			this.register[command.id] = command;
			electronLocalshortcut.register(this.register[command.id].accelerator, this.register[command.id].callback);
			c.log('registering global command');
		}
	}
	else if (scope == 'local') {
		this.register[command.id] = command;
		electronLocalshortcut.register(windowId, this.register[command.id].accelerator, this.register[command.id].callback);
	}

}
function Oryoki() {
	c.log('Oryokiki!');

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	this.windows = [];
	this.registerCommands();
	this.createWindow();
}

Oryoki.prototype.registerCommands = function() {
	CommandManager.registerCommand(
		'global',
		null,
		new Command({
			'id' : 'New window',
			'accelerator' : 'command+n',
			'callback' : this.createWindow.bind(this)
		})
	);
	electronLocalshortcut.register('command+b', () => {
	    c.log('You pressed cmd & b');
	});
}

Oryoki.prototype.createWindow = function() {
	c.log(this.windows.length);
	if(this.windows.length == 0) {
		// Launch
		this.windows.push(
			new Window({
				'id' : this.windows.length,
			})
		);
	}
	else {
		// Additional windows
		this.windows.push(
			new Window({
				'id' : this.windows.length,
				'x' : this.windows[this.windows.length-1].browser.getPosition()[0]+50,
				'y' : this.windows[this.windows.length-1].browser.getPosition()[1]+50
			})
		);
	}
	// c.log(this.windows[this.windows.length-1]);
	this.windows[this.windows.length-1].browser.focus();
}
function Window(parameters) {

	c.log('Window!');

	this.id = parameters.id;
	this.handle = true;
	this.omnibox = true;
	
	this.browser = new BrowserWindow({
	  width: 800,
	  height: 500,
	  frame: false,
	  backgroundColor: '#000',
	  x: parameters.x ? parameters.x : 890,
	  y: parameters.y ? parameters.y : 660
	});

	this.attachEvents();
	this.browser.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	this.browser.webContents.openDevTools();
}

Window.prototype.attachEvents = function() {
	this.browser.webContents.on('did-finish-load', this.onReady.bind(this));
	this.browser.on('closed', this.dispose.bind(this));
}

Window.prototype.onReady = function() {
	this.browser.webContents.send('ready');
	this.registerCommands();
}

Window.prototype.registerCommands = function() {
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle handle',
			'accelerator' : 'command+/',
			'callback' : this.toggleHandle.bind(this)
		})
	);
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle omnibox',
			'accelerator' : 'command+l',
			'callback' : this.toggleOmnibox.bind(this)
		})
	);
}

Window.prototype.toggleHandle = function() {
	if(this.handle) {
		c.log('Hiding handle!');
		this.handle = false;
		this.browser.webContents.send('hideHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] - 22
		);
	}
	else {
		c.log('Showing handle!');
		this.handle = true;
		this.browser.webContents.send('showHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] + 22
		);
	}
}

Window.prototype.toggleOmnibox = function() {
	c.log('Toggling Omnibox');
	if(this.omnibox) {
		this.omnibox = false;
		this.browser.webContents.send('hideOmnibox');
	}
	else {
		this.omnibox = true;
		this.browser.webContents.send('showOmnibox');
	}
}

Window.prototype.dispose = function() {
	this.browser = null;
}
'use strict';
var electron = require('electron');
var ipcMain = require('electron').ipcMain;
var app = electron.app;
var clipboard = require('clipboard');
var electronLocalshortcut = require('electron-localshortcut');
var BrowserWindow = electron.BrowserWindow;
var path = require('path');
var fs = require('fs');

app.on('ready', function() {

  CommandManager = new CommandManager();
  Oryoki = new Oryoki();

});

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

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	this.versions = {
		'chromeVersion' : process.versions.chrome,
		'electronVersion' : process.versions.electron
	}

	this.windows = [];
	this.focusedWindow = null;
	this.attachEvents();
	this.registerCommands();
	this.createWindow();
}

Oryoki.prototype.attachEvents = function() {
	c.log('Creating new window!!');
	ipcMain.on('newWindow', this.createWindow.bind(this));
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

	// electronLocalshortcut.register('command+b', () => {
	//     c.log('You pressed cmd & b');
	// });
}

Oryoki.prototype.createWindow = function() {
	c.log('Creating new window');
	c.log(this.windows.length);
	if(this.windows.length == 0) {
		// No windows open
		this.windows.push(
			new Window({
				'id' : this.windows.length,
				'onFocus' : this.onFocusChange.bind(this),
				'onClose' : this.onWindowClose.bind(this)
			})
		);
	}
	else {
		// Additional windows
		this.windows.push(
			new Window({
				'id' : this.windows.length,
				'onFocus' : this.onFocusChange.bind(this),
				'onClose' : this.onWindowClose.bind(this),
				'x' : this.focusedWindow.browser.getPosition()[0]+50,
				'y' : this.focusedWindow.browser.getPosition()[1]+50
			})
		);
	}
}

Oryoki.prototype.onFocusChange = function(w) {
	this.focusedWindow = w;
	c.log('New focus: ', this.focusedWindow.id);
}

Oryoki.prototype.onWindowClose = function(w) {
	c.log('Closing window #'+ w.id);
	// this.windows[windowId] = null;

	var index = this.windows.indexOf(w);
	c.log('Index', index);
	if (index > -1) {
		this.windows.splice(index, 1);
	}

	// this.windows.pop(windowId);	

	// for (i in this.windows) {
	// 	c.log('W:', this.windows[i].id);	
	// }

}

Oryoki.prototype.getChromeVersion = function() {
	return this.chromeVersion;
}
function Window(parameters) {

	c.log('Window!');

	this.id = parameters.id;
	this.onFocusCallback = parameters.onFocus;
	this.onCloseCallback = parameters.onClose;

	this.handle = true;
	this.omnibox = true;
	this.console = false;
	
	this.browser = new BrowserWindow({
	  width: 800,
	  height: 500,
	  frame: false,
	  backgroundColor: '#000',
	  show: false,
	  x: parameters.x ? parameters.x : 890,
	  y: parameters.y ? parameters.y : 660
	});

	this.attachEvents();
	this.browser.loadURL('file://'+path.join(__dirname, '..', '..', 'html', 'index.html'));
	// this.browser.webContents.openDevTools();
}

Window.prototype.attachEvents = function() {
	this.browser.webContents.on('dom-ready', this.onReady.bind(this));
	this.browser.on('closed', this.onClose.bind(this));
	this.browser.on('focus', this.onFocus.bind(this));

	ipcMain.on('setOmniboxShow', this.setOmniboxShow.bind(this));
	ipcMain.on('setOmniboxHide', this.setOmniboxHide.bind(this));
}

Window.prototype.onReady = function() {
	this.browser.webContents.send('ready');
	this.browser.show();
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
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Toggle console',
			'accelerator' : 'command+alt+c',
			'callback' : this.toggleConsole.bind(this)
		})
	);
}

Window.prototype.onFocus = function() {
	this.onFocusCallback(this);
}

Window.prototype.onClose = function() {
	this.browser = null;
	this.onCloseCallback(this);
}

Window.prototype.setOmniboxShow = function() {
	this.omnibox = true;
}

Window.prototype.setOmniboxHide = function() {
	this.omnibox = false;
}

Window.prototype.showOmnibox = function() {
	c.log('Showing Omnibox');
	this.omnibox = true;
	this.browser.webContents.send('showOmnibox');
}

Window.prototype.hideOmnibox = function() {
	c.log('Hiding Omnibox');
	this.omnibox = false;
	this.browser.webContents.send('hideOmnibox');
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

Window.prototype.toggleConsole = function() {
	c.log(this.console);
	if(this.console) {
		c.log('hiding console');
		this.console = false;
		this.browser.webContents.send('hideConsole');
	}
	else {
		c.log('showing console');
		this.console = true;
		this.browser.webContents.send('showConsole');
	}
}

Window.prototype.toggleOmnibox = function() {
	c.log('Toggling Omnibox');
	if(this.omnibox) {
		this.hideOmnibox();
	}
	else {
		this.showOmnibox();
	}
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
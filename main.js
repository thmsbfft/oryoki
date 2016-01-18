function Command(options) {

	this.id = options.id;
	this.accelerator = options.accelerator;
	this.callback = options.callback;

}
function CommandManager() {
	this.register = {};
}

CommandManager.prototype.registerCommand = function(scope, browserWindow, command) {

	if(scope == 'global') {
		if(!this.register[command.id]) {
			this.register[command.id] = command;
			electronLocalshortcut.register(this.register[command.id].accelerator, this.register[command.id].callback);
		}
	}
	else if (scope == 'local') {
		this.register[command.id] = command;
		electronLocalshortcut.register(browserWindow, this.register[command.id].accelerator, this.register[command.id].callback);
	}

}

CommandManager.prototype.unregisterAll = function(browserWindow) {
	electronLocalshortcut.unregisterAll(browserWindow);
};
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
	this.windowsIndex = -1; // Index to make sure we assign unique Ids
	this.windowCount = 0; // Counts the number of windows currently open
	this.attachEvents();
	this.registerCommands();
	this.createWindow();
}

Oryoki.prototype.attachEvents = function() {
	// ipcMain.on('newWindow', this.createWindow.bind(this));
	// ipcMain.on('newWindow', function(e, url) {
	// 	c.log(url);
	// 	this.createWindow(url).bind(this);
	// }.bind(this));
	ipcMain.on('newWindow', this.createWindow.bind(this));
	ipcMain.on('closeWindow', this.closeWindow.bind(this));
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
	CommandManager.registerCommand(
		'global',
		null,
		new Command({
			'id' : 'Close window',
			'accelerator' : 'command+w',
			'callback' : this.closeWindow.bind(this)
		})
	);
}

Oryoki.prototype.createWindow = function(e, url) {
	if(url) {
		var url = url[0];
	}


	this.windowsIndex++;
	this.windowCount++;

	if(this.windowCount == 1) {
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this)
		});
		this.windows[this.windowsIndex].browser.center();
	}
	else {
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'x' : this.focusedWindow.browser.getPosition()[0]+50,
			'y' : this.focusedWindow.browser.getPosition()[1]+50
		});
	}
}

Oryoki.prototype.onFocusChange = function(w) {
	this.focusedWindow = w;
}

Oryoki.prototype.closeWindow = function() {
	if(this.windowCount > 0) {
		this.focusedWindow.close();
		this.windowCount--;
		var index = this.windows.indexOf(this.focusedWindow);
		if (index > -1) {
			this.windows.splice(index, 1);
		}
	}
	if(this.windowCount == 0) {
		this.focusedWindow = null;
	}
}

Oryoki.prototype.getChromeVersion = function() {
	return this.chromeVersion;
}
function Window(parameters) {


	this.id = parameters.id;
	if(parameters.url != null) {
		c.log(parameters.url);
		this.url = parameters.url;
	}

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
	this.browser.on('focus', this.onFocus.bind(this));

	ipcMain.on('setOmniboxShow', this.setOmniboxShow.bind(this));
	ipcMain.on('setOmniboxHide', this.setOmniboxHide.bind(this));
}

Window.prototype.onReady = function() {
	this.browser.webContents.send('ready');
	if(this.url) this.browser.webContents.send('load', this.url);
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
	CommandManager.registerCommand(
		'local',
		this.browser,
		new Command({
			'id' : 'Reload',
			'accelerator' : 'command+r',
			'callback' : this.reload.bind(this)
		})
	);
}

Window.prototype.onFocus = function() {
	this.onFocusCallback(this);
}

Window.prototype.close = function() {
	CommandManager.unregisterAll(this.browser);
	this.browser.close();
	this.browser = null;
}

Window.prototype.setOmniboxShow = function() {
	this.omnibox = true;
}

Window.prototype.setOmniboxHide = function() {
	this.omnibox = false;
}

Window.prototype.showOmnibox = function() {
	this.omnibox = true;
	this.browser.webContents.send('showOmnibox');
}

Window.prototype.hideOmnibox = function() {
	this.omnibox = false;
	this.browser.webContents.send('hideOmnibox');
}

Window.prototype.toggleHandle = function() {
	if(this.handle) {
		this.handle = false;
		this.browser.webContents.send('hideHandle');
		this.browser.setSize(
			this.browser.getSize()[0],
			this.browser.getSize()[1] - 22
		);
	}
	else {
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
		this.console = false;
		this.browser.webContents.send('hideConsole');
	}
	else {
		this.console = true;
		this.browser.webContents.send('showConsole');
	}
}

Window.prototype.toggleOmnibox = function() {
	if(this.omnibox) {
		this.hideOmnibox();
	}
	else {
		this.showOmnibox();
	}
}

Window.prototype.reload = function() {
	this.browser.webContents.send('reload');
}

Window.prototype.load = function(url) {
	this.browser.webContents.send('load', url);
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
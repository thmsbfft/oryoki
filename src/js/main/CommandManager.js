function CommandManager() {
	this.register = {};
	this.template = undefined;
	this.menu = undefined;
	// @if NODE_ENV='development'
	c.log('INIT COMMANDMANAGER');
	// @endif

	// Allow for renderer to set menus
	ipcMain.on('set-menu-enabled', function(event, menuLabel, subMenuLabel, value) {
	  this.setEnabled(menuLabel, subMenuLabel, value);
	}.bind(this));

	this.createMenus();
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
}

CommandManager.prototype.createMenus = function() {
	var name = app.getName();
	this.template = [
		{
			label: name,
			submenu: [
				{
					label: 'About ' + name,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'Preferences',
					submenu: [
						{
							label: 'Open',
							accelerator: 'Command+,',
							click: function() {
								UserManager.openPreferencesFile();
							}
						},
						{
							type: 'separator'
						},
						{
							label: 'Reset',
							click: function() {
								UserManager.resetUserPreferencesToFactory();
							}
						},
						{
							type: 'separator'
						},
						{
							label: 'Browse data...',
							click: function() {
								shell.openItem(UserManager.user.confPath);
							}
						}
					]
				},
				{
					type: 'separator'
				},
				{
					label: 'Clear Cache',
					click: function() {
						if(Oryoki) Oryoki.clearCaches();
					}
				},
				{
					label: 'Clear Local Storage',
					click: function() {
						if(Oryoki) Oryoki.clearLocalStorage();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + name,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: function() { app.quit() }
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Shift+CmdOrCtrl+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					role: 'copy'
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					role: 'cut'
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'File',
			submenu: [
				{
					label: 'New Window',
					accelerator: 'Cmd+N',
					click: function() {
						if(Oryoki) Oryoki.createWindow();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Close Window',
					accelerator: 'Cmd+W',
					role: 'close'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Title Bar',
					accelerator: 'Cmd+/',
					type: 'checkbox',
					click:function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleHandle();
						}
					}
				},
				{
					label: 'Toggle Omnibox',
					accelerator: 'Cmd+L',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleOmnibox();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.reload();
							}
						}
					}
				},
				{
					label: 'Hard Reload',
					accelerator: 'CmdOrCtrl+Shift+R',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.clearCaches();
								Oryoki.focusedWindow.reload();
							}
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Fullscreen',
					accelerator: 'Cmd+Ctrl+F',
					type: 'checkbox',
					click: function() { if(Oryoki) Oryoki.toggleFullScreen() }
				},
				{
					type: 'separator'
				},
				{
					label: 'Navigate Back',
					accelerator: 'Cmd+Left',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.navigateBack();
						}
					}
				},
				{
					label: 'Navigate Forward',
					accelerator: 'Cmd+Right',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.navigateForward();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Downloads',
					click: function() {
						if(Oryoki) { Oryoki.goToDownloads() }
					}
				}
			]
		},
		{
			label: 'Tools',
			submenu: [
				{
					label: 'Window Helper',
					accelerator: 'Cmd+Alt+M',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleWindowHelper();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Screenshot',
					accelerator: 'Cmd+Shift+`',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.camera.takeScreenshot();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Mini Console',
					accelerator: 'Cmd+Alt+C',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.toggleConsole();
						}
					}
				},
				{
					label: 'Toggle Devtools',
					accelerator: 'Cmd+Alt+I',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.toggleDevTools()
							}
						}
					}
				}
			]
		},
		{
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'Cmd+M',
					role: 'minimize'
				},
				{
					label: 'Float on Top',
					type: 'checkbox',
					click: function() {
						if(Oryoki.focusedWindow) {
							Oryoki.focusedWindow.setAlwaysOnTopToggle();
						}
					}
				}
			]
		},
		{
			label: 'Help',
			role: 'help',
			submenu: [
				{
					label: 'Feedback',
					click: function() {
						var osVersion = require('os').release();
						var oryokiVersion = Oryoki.versions.oryoki;
						require("openurl").open("mailto:write@oryoki.io?subject=Ōryōki ⭕️ Feedback&body=\n\nŌryōki: v."+oryokiVersion+"\nOperating System: Darwin v."+osVersion);
					}
				}
			]
		}
	];
	this.menu = Menu.buildFromTemplate(this.template);
	Menu.setApplicationMenu(this.menu);
}

CommandManager.prototype.toggleChecked = function(menuLabel, subMenuLabel) {
	// Only works for two levels of menus for now
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].checked == !submenu[0].checked;
}

CommandManager.prototype.setCheckbox = function(menuLabel, subMenuLabel, value) {
	// Only works for two levels of menus for now
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].checked = value;
}

CommandManager.prototype.setEnabled = function(menuLabel, subMenuLabel, value) {
	var menu = this.getMenuByLabel(menuLabel);
	var submenu = this.getSubMenuByLabel(menu, subMenuLabel);
	submenu[0].enabled = value;
}

CommandManager.prototype.getMenuByLabel = function(menuLabel) {
	return this.menu.items.filter(item => item.label == menuLabel);
}

CommandManager.prototype.getSubMenuByLabel = function(menu, subMenuLabel) {
	return menu[0].submenu.items.filter(item => item.label == subMenuLabel);
}
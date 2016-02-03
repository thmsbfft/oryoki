function CommandManager() {
	this.register = {};
	this.template = undefined;
	// @if NODE_ENV='development'
	c.log('INIT COMMANDMANAGER');
	// @endif
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
						if(Oryoki) Oryoki.createWindow()
					}
				},
				{
					label: 'Close Window',
					accelerator: 'Cmd+W',
					role: 'close'
					// click: function() {
					// 	if(Oryoki) Oryoki.closeWindow()
					// }
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: function() {
						if(Oryoki) {
							if(Oryoki.focusedWindow) {
								Oryoki.focusedWindow.reload()
							}
						}
					}
				},
				{
					type: 'separator'
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
					// click: function() {
					// 	if(Oryoki && Oryoki.focusedWindow) {
					// 		Oryoki.minimizeWindow()
					// 	}
					// }
				}
			]
		}
	];
	var menu = Menu.buildFromTemplate(this.template);
	Menu.setApplicationMenu(menu);
}
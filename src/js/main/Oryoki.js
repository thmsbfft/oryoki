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
		// Launch
		this.windows.push(
			new Window({
				'id' : this.windows.length,
				'onFocus' : this.onFocusChange
			})
		);
	}
	else {
		// Additional windows
		this.windows.push(
			new Window({
				'id' : this.windows.length,
				'onFocus' : this.onFocusChange,
				'x' : this.windows[this.windows.length-1].browser.getPosition()[0]+50,
				'y' : this.windows[this.windows.length-1].browser.getPosition()[1]+50
			})
		);
	}
	this.windows[this.windows.length-1].browser.focus();
}

Oryoki.prototype.onFocusChange = function(windowId) {
	this.focusedWindow = windowId;
	c.log('New focus: ', this.focusedWindow);
}

Oryoki.prototype.getChromeVersion = function() {
	return this.chromeVersion;
}
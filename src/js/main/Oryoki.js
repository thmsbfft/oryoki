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
		// c.log('VICTOIRE ENCULÉ', url);
		var url = url[0];
	}

	c.log('Creating new window');
	c.log(this.windows.length);

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
	c.log('New focus: ', this.focusedWindow.id);
}

Oryoki.prototype.closeWindow = function() {
	c.log('Closing window #'+ this.focusedWindow.id);
	this.focusedWindow.close();

	this.windowCount--;

	var index = this.windows.indexOf(this.focusedWindow);
	c.log('Closing window index', index);
	if (index > -1) {
		this.windows.splice(index, 1);
	}

	if(this.windowCount == 0) {
		this.focusedWindow = null;
	}
}

Oryoki.prototype.getChromeVersion = function() {
	return this.chromeVersion;
}
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
	ipcMain.on('newWindow', this.createWindow.bind(this));
	ipcMain.on('minimizeWindow', this.minimizeWindow.bind(this));
}

Oryoki.prototype.registerCommands = function() {

}

Oryoki.prototype.createWindow = function(e, url) {
	if(url) {
		var url = url[0];
	}

	// @if NODE_ENV='development'
	c.log('Creating new window...');
	c.log(this.windows.length);
	// @endif

	this.windowsIndex++;
	this.windowCount++;

	if(this.windowCount == 1) {
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this)
		});
		this.windows[this.windowsIndex].browser.center();
	}
	else {
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this),
			'x' : this.focusedWindow.browser.getPosition()[0]+50,
			'y' : this.focusedWindow.browser.getPosition()[1]+50
		});
	}
}

Oryoki.prototype.onFocusChange = function(w) {
	this.focusedWindow = w;
	// @if NODE_ENV='development'
	c.log('New focus: ', this.focusedWindow.id);
	// @endif
}

Oryoki.prototype.onCloseWindow = function() {
	if(this.windowCount > 0) {
		// @if NODE_ENV='development'
		c.log('Closing window #'+ this.focusedWindow.id);
		// @endif
		// this.focusedWindow.close();
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

Oryoki.prototype.minimizeWindow = function() {
	if(this.windowCount > 0) {
		this.focusedWindow.browser.minimize();
	} 
}

Oryoki.prototype.getChromeVersion = function() {
	return this.chromeVersion;
}
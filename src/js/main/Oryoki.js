function Oryoki() {

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	this.versions = {
		'oryoki' : '0.0.2',
		'chromeVersion' : process.versions.chrome,
		'electronVersion' : process.versions.electron
	}

	this.windows = [];
	this.focusedWindow = null;
	this.windowsIndex = -1; // Index to make sure we assign unique Ids
	this.windowCount = 0; // Counts the number of windows currently open
	this.attachEvents();
	this.createWindow();
}

Oryoki.prototype.attachEvents = function() {
	ipcMain.on('newWindow', this.createWindow.bind(this));
	ipcMain.on('minimizeWindow', this.minimizeWindow.bind(this));
	ipcMain.on('closeWindow', this.closeWindow.bind(this));
	ipcMain.on('fullscreenWindow', this.toggleFullScreen.bind(this));
}

Oryoki.prototype.createWindow = function(e, url) {
	if(url) {
		// _target = blank
		var url = url[0];
	}
	else if(UserManager.getPreferenceByName("use_homepage")) {
		// homepage
		var url = UserManager.getPreferenceByName("homepage_url");
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

Oryoki.prototype.closeWindow = function() {
	// This function to be triggered when click on emulated traffic lights.
	this.focusedWindow.close();
	this.onCloseWindow();
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

Oryoki.prototype.toggleFullScreen = function() {
	if(this.windowCount > 0) {
		if(this.focusedWindow.browser.isFullScreen()) {
			this.focusedWindow.browser.setFullScreen(false);
		}
		else {
			this.focusedWindow.browser.setFullScreen(true);
			if(this.focusedWindow.handle) this.focusedWindow.toggleHandle();
		}
	}
}

Oryoki.prototype.getChromeVersion = function() {
	return this.chromeVersion;
}
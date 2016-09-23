function Oryoki() {

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	// @if NODE_ENV='development'
	c.log('[Oryoki] ✔');
	c.log('[Oryoki] v.' + app.getVersion());
	// @endif

	this.versions = {
		'oryoki' : '0.0.4',
		'chromeVersion' : process.versions.chrome,
		'electronVersion' : process.versions.electron
	}

	this.windows = [];
	this.focusedWindow = null;
	this.windowsIndex = 0; // Index to make sure we assign unique Ids
	this.windowCount = 0; // Counts the number of windows currently open

	this.attachEvents();
	if(UserManager.getPreferenceByName("clear_caches_on_launch")) this.clearCaches();
	if(UserManager.getPreferenceByName("override_download_path")) app.setPath('downloads', UserManager.getPreferenceByName("download_path"));
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
	c.log('[Oryoki] Creating new window');
	// @endif

	if(this.windowCount == 0) {
		// No window open -> create a centered window
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this)
		});
		this.windows[this.windowsIndex].browser.center();
	}
	else {
		// Window already open -> create a window offset relative to focused window
		this.windows[this.windowsIndex] = new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this),
			'x' : this.focusedWindow.browser.getPosition()[0]+50,
			'y' : this.focusedWindow.browser.getPosition()[1]+50,
			'width' : this.focusedWindow.browser.getBounds().width,
			'height' : this.focusedWindow.browser.getBounds().height
		});
	}

	this.windowsIndex++;
	this.windowCount++;

	// @if NODE_ENV='development'
	c.log('[Oryoki] Currently', this.windowCount, 'windows open');
	// @endif

}

Oryoki.prototype.onFocusChange = function(w) {

	this.focusedWindow = w;
	
	// @if NODE_ENV='development'
	c.log('[Oryoki] New focus:', this.focusedWindow.id);
	// @endif

}

Oryoki.prototype.closeWindow = function() {

	// EMULATED TRAFFIC LIGHTS CLICK

	// @if NODE_ENV='development'
	c.log('[Oryoki] Requesting closing window #'+ this.focusedWindow.id);
	// @endif
	
	this.focusedWindow.close();

}

Oryoki.prototype.onCloseWindow = function() {

	if(this.windowCount > 0) {
		// @if NODE_ENV='development'
		c.log('[Oryoki] Closing window #'+ this.focusedWindow.id);
		// @endif
		this.windowCount--;
		var index = this.windows.indexOf(this.focusedWindow);
		if (index > -1) {
			this.windows.splice(index, 1);
		}
	}

	if(this.windowCount == 0) {
		this.focusedWindow = null;
	}

	// @if NODE_ENV='development'
	c.log('[Oryoki] Currently', this.windowCount, 'windows open');
	// @endif

}

Oryoki.prototype.minimizeWindow = function() {

	if(this.windowCount > 0) {
		this.focusedWindow.browser.minimize();
	}

}

Oryoki.prototype.toggleFullScreen = function() {

	if(this.windowCount > 0) {
		if(UserManager.getPreferenceByName("picture_in_picture")) {
			this.focusedWindow.browser.setFullScreenable(true);
			this.focusedWindow.browser.setFullScreen(!this.focusedWindow.browser.isFullScreen());
			this.focusedWindow.browser.setFullScreenable(false);
		}
		else {
			this.focusedWindow.browser.setFullScreen(!this.focusedWindow.browser.isFullScreen());
		}
	}

	CommandManager.toggleChecked('View', 'Fullscreen');

}

Oryoki.prototype.clearCaches = function() {

	var caches = [
		'Cache',
		'GPUCache'
	];

	var errors = 0;

	caches.forEach(function(element) {

		var folderPath = UserManager.user.paths.conf + '/' + element;
		folderPath = folderPath.replace(' ', '\\ ');
		// @if NODE_ENV='development'
		c.log('[ORYOKI] Will delete: ' + folderPath);
		// @endif
		exec('cd ' + folderPath + ' && rm *', function(error, stdout, stderr) {
			if(error) {
				errors++;
				// If folder is already clear, do nothing
			}
		}.bind(this));
	}.bind(this));

	if(this.focusedWindow) {
		this.focusedWindow.browser.webContents.send('unfreeze-status');
		this.focusedWindow.browser.webContents.send('log-status', {
			'body' : 'Cleared caches'
		});
	}

}

Oryoki.prototype.clearLocalStorage = function() {

	var folderPath = UserManager.user.paths.conf.replace(' ', '\\ ') + '/Local\\ Storage';
	// @if NODE_ENV='development'
	c.log('[ORYOKI] Will delete: ' + folderPath);
	// @endif
	exec('cd ' + folderPath + ' && rm *', function(error, stdout, stderr) {
		if(error) {
			// If folder is already clear, do nothing
		}
		if(this.focusedWindow) {
			this.focusedWindow.browser.webContents.send('unfreeze-status');
			this.focusedWindow.browser.webContents.send('log-status', {
				'body' : 'Cleared local storage'
			});
		}
	}.bind(this));

}

Oryoki.prototype.goToDownloads = function() {

	shell.openItem(app.getPath('downloads'));

}
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
		'oryoki' : '0.0.2',
		'chromeVersion' : process.versions.chrome,
		'electronVersion' : process.versions.electron
	}

	this.windows = [];
	this.focusedWindow = null;
	this.windowsIndex = -1; // Index to make sure we assign unique Ids
	this.windowCount = 0; // Counts the number of windows currently open

	this.attachEvents();
	if(UserManager.getPreferenceByName("clear_cache_on_launch")) this.clearCaches();
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

	this.windowsIndex++;
	this.windowCount++;

	// @if NODE_ENV='development'
	c.log('[Oryoki] Currently', this.windowCount, 'windows open');
	// @endif

	if(this.windowCount == 1) {
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
			'y' : this.focusedWindow.browser.getPosition()[1]+50
		});
	}

}

Oryoki.prototype.onFocusChange = function(w) {

	this.focusedWindow = w;
	
	// @if NODE_ENV='development'
	c.log('[Oryoki] New focus:', this.focusedWindow.id);
	// @endif

}

Oryoki.prototype.closeWindow = function() {

	// This function to be triggered when click on emulated traffic lights.

	// @if NODE_ENV='development'
	c.log('[Oryoki] Close window');
	// @endif
	
	this.focusedWindow.close();
	this.onCloseWindow();

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

}

Oryoki.prototype.minimizeWindow = function() {

	if(this.windowCount > 0) {
		this.focusedWindow.browser.minimize();
	}

}

Oryoki.prototype.toggleFullScreen = function() {

	if(this.windowCount > 0) {
		this.focusedWindow.browser.setFullScreen(!this.focusedWindow.browser.isFullScreen());
	}

	CommandManager.toggleChecked('View', 'Fullscreen');

}

Oryoki.prototype.clearCaches = function() {

	var caches = [
		'Cache',
		'GPUCache'
	];

	caches.forEach(function(element) {

		var folderPath = UserManager.user.confPath + '/' + element;
		folderPath = folderPath.replace(' ', '\\ ');
		// @if NODE_ENV='development'
		c.log('[ORYOKI] Will delete: ' + folderPath);
		// @endif
		exec('cd ' + folderPath + ' && rm *', function(error, stdout, stderr) {

			if(error) {
				if(this.focusedWindow) {
					this.focusedWindow.browser.webContents.send('display-notification', {
						'body' : 'Error – ' + error,
						'lifespan' : 3000,
					});
				}
			}
		}.bind(this));
	}.bind(this));

	if(this.focusedWindow) {
		this.focusedWindow.browser.webContents.send('display-notification', {
			'body' : 'Cleared caches',
			'lifespan' : 3000
		});
	}

}

Oryoki.prototype.clearLocalStorage = function() {

	var folderPath = UserManager.user.confPath.replace(' ', '\\ ') + '/Local\\ Storage';
	// @if NODE_ENV='development'
	c.log('[ORYOKI] Will delete: ' + folderPath);
	// @endif
	exec('cd ' + folderPath + ' && rm *', function(error, stdout, stderr) {
		if(error) {
			if(this.focusedWindow) {
				this.focusedWindow.browser.webContents.send('display-notification', {
					'body' : 'Error – ' + error,
					'lifespan' : 3000,
				});
			}
		}
		else {
			if(this.focusedWindow) {
				this.focusedWindow.browser.webContents.send('display-notification', {
					'body' : 'Cleared local storage',
					'lifespan' : 3000,
				});
			}
		}
	}.bind(this));

}

Oryoki.prototype.goToDownloads = function() {

	shell.openItem(app.getPath('downloads'));

}
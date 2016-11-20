function Oryoki() {

	app.on('window-all-closed', function() {
	  if (process.platform != 'darwin') {
	    app.quit();
	  }
	});

	app.on('will-finish-launching', function() {
		app.on('open-file', function(event, path) {
			// @if NODE_ENV='development'
			c.log('File dragged on app icon');
			// @endif
		}.bind(this));
	}.bind(this));

	// @if NODE_ENV='development'
	c.log('[Oryoki] v.' + app.getVersion());
	// @endif

	this.versions = {
		'oryoki' : app.getVersion(),
		'chromium' : process.versions.chrome,
		'electron' : process.versions.electron
	}

	this.windows = [];
	this.focusedWindow = null;
	this.windowsIndex = 0; // Index to make sure we assign unique Ids

	this.attachEvents();
	if(UserManager.getPreferenceByName("clear_caches_on_launch")) this.clearCaches();
	
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

		if(this.focusedWindow) {
			if(this.focusedWindow.isFirstLoad) {
				this.focusedWindow.load(url);
				return;
			}
		}

	}
	else if(UserManager.getPreferenceByName("homepage_url") !== "") {
		// homepage
		var url = UserManager.getPreferenceByName("homepage_url");
	}

	// @if NODE_ENV='development'
	c.log('[Oryoki] Creating new window');
	// @endif

	if(this.windows.length == 0) {
		// No window open -> create a centered window
		this.windows.push(new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this)
		}));
		this.windows[this.windows.length-1].browser.center();
	}
	else {
		// Window already open -> create a window offset relative to focused window
		this.windows.push(new Window({
			'id' : this.windowsIndex,
			'url' : url ? url : null,
			'onFocus' : this.onFocusChange.bind(this),
			'onClose' : this.onCloseWindow.bind(this),
			'x' : this.focusedWindow.browser.getPosition()[0]+50,
			'y' : this.focusedWindow.browser.getPosition()[1]+50,
			'width' : this.focusedWindow.browser.getBounds().width,
			'height' : this.focusedWindow.browser.getBounds().height
		}));
	}

	this.windowsIndex++;

	// @if NODE_ENV='development'
	c.log('[Window] ---');

	for (var i = 0; i < this.windows.length; i++) {
		c.log('         ' + this.windows[i].id);
	}

	c.log('[Window] ---');
	// @endif

}

Oryoki.prototype.openFile = function() {

	dialog.showOpenDialog(
		{
			properties: ['openFile'], // Only one file at a time
			filters: [
				{name: 'Images', extensions: ['png']}
			]
		}
	, this.handleFile.bind(this));

}

Oryoki.prototype.handleFile = function(input) {

	if(input == undefined) return;
	var path = input[0];

	// @if NODE_ENV='development'
	c.log(path);
	// @endif

	var buffer = fs.readFileSync(path);
	var chunks = extract(buffer);

	// Extract all tEXt chunks
	var textChunks = chunks.filter(function (chunk) {
		return chunk.name === 'tEXt';
	}).map(function (chunk) {
		return text.decode(chunk.data);
	});

	// Look for the src keyword
	var src = textChunks.filter(function (chunk) {
		return chunk.keyword === 'src';
	});

	if(!src[0]) {

		// Abort!
		if(this.focusedWindow) {
			this.focusedWindow.browser.webContents.send('log-status', {
				'body' : 'Can\'t open file',
				'icon' : '⭕️'
			});
		}
		return;

	}

	// Check if the content is an url
	if(validUrl.isUri(src[0].text)) {
		
		var url = src[0].text;

		if(this.focusedWindow && this.focusedWindow.isFirstLoad) {
			// Loading in current window
			this.focusedWindow.load(url);
			this.focusedWindow.browser.webContents.send('log-status', {
				'body' : 'Loading ' + url,
			});
		}
		else {
			// Loading in new window
			this.createWindow(null, [url]);
		}

	}
	else {

		// Abort!
		if(this.focusedWindow) {
			this.focusedWindow.browser.webContents.send('log-status', {
				'body' : 'Can\'t open file',
				'icon' : '⭕️'
			});
		}
		return;

	}

}

Oryoki.prototype.onFocusChange = function(w) {

	this.focusedWindow = w;
	Camera.browser = this.focusedWindow.browser;

	// @if NODE_ENV='development'
	c.log('[Oryoki] New focus:', this.focusedWindow.id);
	// @endif

}

Oryoki.prototype.closeWindow = function() {
	
	this.focusedWindow.close();

}

Oryoki.prototype.onCloseWindow = function() {

	var index = this.windows.indexOf(this.focusedWindow);
	this.windows.splice(index, 1);

	if(this.windows.length == 0) this.focusedWindow = null;

	// @if NODE_ENV='development'
	c.log('[Window] ---');
	for (var i = 0; i < this.windows.length; i++) {
		c.log('         ' + this.windows[i].id);
	}
	c.log('[Window] ---');
	// @endif

}

Oryoki.prototype.minimizeWindow = function() {

	if(this.windows.length > 0) {
		this.focusedWindow.browser.minimize();
	}

}

Oryoki.prototype.focusNextWindow = function() {

	if(this.windows.length > 0) {

		var index = this.windows.indexOf(this.focusedWindow) + 1;

		if(index >= this.windows.length) {
			index = 0;
		}

		this.windows[index].focus();

	}	

}

Oryoki.prototype.toggleFullScreen = function() {

	if(this.windows.length > 0) {
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

Oryoki.prototype.onBeforeQuit = function() {

	// @if NODE_ENV='development'
	c.log('[ORYOKI] Will quit');
	// @endif

	// Close About
	About.bw.removeAllListeners('close');
	About.bw.close();

	// @if NODE_ENV='development'
	c.log('[Window] ---');
	for (var i = 0; i < this.windows.length; i++) {
		c.log('         ' + this.windows[i].id);
	}
	c.log('[Window] ---');
	// @endif

}

Oryoki.prototype.quit = function() {

	this.onBeforeQuit();
	app.quit();

}
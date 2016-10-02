function Updater() {
	
	// @if NODE_ENV='development'
	c.log('[Updater] ✔');
	// c.log('[Updater] v.' + app.getVersion());
	// @endif

	this.tmpDir = undefined;

	this.latest = undefined;
	this.feedURL = 'http://oryoki.io/latest.json';

	this.checkForUpdate(false);

}

Updater.prototype.checkForUpdate = function(alert) {
	
	// @if NODE_ENV='development'
	c.log('[Updater] Checking for updates...');
	// @endif

	CommandManager.refreshMenus();

	request(this.feedURL, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			this.latest = JSON.parse(body);
			this.compareVersions(alert);
		}
		if(error) {
			// @if NODE_ENV='development'
			c.log('[Updater] ' + error);
			// @endif
		}
	}.bind(this));

}

Updater.prototype.compareVersions = function(alert) {

	var current = app.getVersion().split('.');
	var suspect = this.latest.version.split('.');

	for(var i=0; i < suspect.length; i++) {
		
		// major.minor.revision

		if(parseInt(suspect[i]) > parseInt(current[i])) {

			// @if NODE_ENV='development'
			c.log('[Updater] Available: ' + this.latest.version);
			// @endif

			this.downloadUpdate();

			return;

		}
	}

	// @if NODE_ENV='development'
	c.log('[Updater] No update available');
	// @endif

	if(alert) {

		dialog.showMessageBox(
			{
				type: 'info',
				message: 'Ōryōki is up to date.',
				detail: 'Version ' + Oryoki.versions.oryoki + ' is the latest version.',
				buttons: ['OK'],
				defaultId: 0
			}
		);

	}

}

Updater.prototype.downloadUpdate = function() {

	// @if NODE_ENV='development'
	c.log('[Updater] Downloading update');
	// @endif

	CommandManager.setEnabled(app.getName(), 'Check for Update', false);

	if(Oryoki.focusedWindow) {
		Oryoki.focusedWindow.browser.webContents.send('log-important', {
			'body' : 'Downloading update...',
			'icon' : '👀'
		});
	}

	// Create a TMP folder
	this.tmpDir = UserManager.user.paths.tmp + '/' + 'Update-' + this.latest.version;

	try {
		fs.statSync(this.tmpDir);
	}
	catch(err) {
		if(err.code === 'ENOENT') {
			fs.mkdirSync(this.tmpDir);
		}
		else {
			throw err;
		}
	}

	// Start downloading
	exec('cd ' + '\'' + this.tmpDir + '\'' + ' && curl -O ' + this.latest.url, function(error, stdout, stderr) {
		
		if(error) {
			throw error;
		}

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done downloading');
			// @endif

			if(Oryoki.focusedWindow) {
				Oryoki.focusedWindow.browser.webContents.send('unfreeze-status');
			}

			// TODO move down to toggle back on when update is ready to install
			CommandManager.setEnabled(app.getName(), 'Check for Update', true);

			this.extractUpdate();

		}
	
	}.bind(this));

}

Updater.prototype.extractUpdate = function() {

	// Unzip archive
	exec('cd ' + '\'' + this.tmpDir + '\'' + ' && unzip -qq Oryoki-' + this.latest.version, function(error, stdout, stderr) {

		if(error) {
			throw error;
		}

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done extracting');
			// @endif

			// TESTING
			// exec('open ' + '\'' + this.tmpDir + '/Oryoki.app' + '\'');
			this.cleanUp();
			
		}

	}.bind(this));

}

Updater.prototype.cleanUp = function() {

	exec('rm -rf ' + '\'' + this.tmpDir + '\'', function(error, stdout, stderr) {

		if(error) throw error;

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done cleaning up');
			// @endif

		}

	}.bind(this));

}

Updater.prototype.quitAndInstall = function() {
	


}
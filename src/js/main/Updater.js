function Updater() {
	
	// @if NODE_ENV='development'
	c.log('[Updater] ✔');
	// @endif

	this.tmpDir = undefined;
	this.status = 'no-update';

	this.latest = undefined;
	this.feedURL = 'http://oryoki.io/latest.json';

	this.cleanUp();
	this.checkForUpdate(false);

	ipcMain.on('quit-and-install', this.quitAndInstall.bind(this));

}

Updater.prototype.checkForUpdate = function(alert) {
	
	// @if NODE_ENV='development'
	c.log('[Updater] Checking for updates...');
	// @endif

	request(this.feedURL, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			this.latest = JSON.parse(body);
			this.compareVersions(alert);
		}
		if(error) {
			// @if NODE_ENV='development'
			c.log('[Updater] ' + error);
			// @endif

			if(alert) {

				dialog.showMessageBox(
					{
						type: 'info',
						message: 'Oops! There was a problem checking for update.',
						detail: 'It seems like the Internet connection is offline.',
						buttons: ['OK'],
						defaultId: 0
					}
				);

			}

		}
	}.bind(this));

}

Updater.prototype.compareVersions = function(alert) {

	var current = app.getVersion().split('.');
	var suspect = this.latest.version.split('.');

	for(var i=0; i < suspect.length; i++) {
		
		// major.minor.revision, single digits

		if(parseInt(suspect[i]) > parseInt(current[i])) {

			// @if NODE_ENV='development'
			c.log('[Updater] Available: ' + this.latest.version);
			// @endif

			this.status = 'update-available';
			CommandManager.refreshMenus();

			if(UserManager.getPreferenceByName('download_updates_in_background')) this.downloadUpdate();
			else {

				new Notification('Update available!', {
					body: 'Ōryōki ' + this.latest.version + ' is available.',
					silent: true
				});

			}

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

	this.status = 'downloading-update';
	CommandManager.refreshMenus();

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
	var downloadProcess = exec('cd ' + '\'' + this.tmpDir + '\'' + ' && curl -O ' + this.latest.url, function(error, stdout, stderr) {
		
		if(error) {
			// @if NODE_ENV='development'
			c.log('[Updater] Download failed. Err: ' + error.signal);
			// @endif
			this.cleanUp();
			// throw error;
		}

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done downloading');
			// @endif

			this.isDownloading = false;

			this.extractUpdate();

		}
	
	}.bind(this));

}

Updater.prototype.extractUpdate = function() {

	// Unzip archive
	exec('cd ' + '\'' + this.tmpDir + '\'' + ' && unzip -qq Oryoki-' + this.latest.version, function(error, stdout, stderr) {

		if(error) {
			// @if NODE_ENV='development'
			c.log('[Updater] Extracting failed. Err: ' + error.signal);
			// @endif
			this.cleanUp();
		}

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done extracting');
			// @endif

			this.status = 'update-ready';
			CommandManager.refreshMenus();

			if(Oryoki.focusedWindow) {
				for (var i = 0; i < Oryoki.windows.length; i++) {
					Oryoki.windows[i].browser.webContents.send('update-ready', this.latest);
				}
			}

			new Notification('Update available!', {
				body: 'Ōryōki ' + this.latest.version + ' is ready to be installed.',
				silent: true
			});
			
		}

	}.bind(this));

}

Updater.prototype.quitAndInstall = function() {

	// In case a previous version is still in downloads
	execSync('rm -rf ' + '\"' + app.getPath('downloads') + '/Oryoki.app' + '\"');

	// Move to downloads
	fs.rename(this.tmpDir + '/Oryoki.app', app.getPath('downloads') + '/Oryoki.app', function(err) {

		if(err) {
			// @if NODE_ENV='development'
			c.log('[Updater] Error while moving update: ' + err);
			// @endif
		}

		// Reveal in Finder
		execSync('open -R ' + app.getPath('downloads') + '/Oryoki.app', function(err) {
			if(err) {
				// @if NODE_ENV='development'
				c.log('[Updater] Error while revealing update: ' + err);
				// @endif
			}
		}.bind(this));

		this.cleanUp();
		Oryoki.quit();

	}.bind(this));

}

Updater.prototype.cleanUp = function() {

	c.log('Cleaning up');

	exec('cd ' + '\'' + UserManager.user.paths.tmp + '\'' + ' && rm -rf Update-*', function(error, stdout, stderr) {

		if(error) throw error;

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done cleaning up');
			// @endif

		}

	}.bind(this));

}
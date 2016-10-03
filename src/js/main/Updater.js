function Updater() {
	
	// @if NODE_ENV='development'
	c.log('[Updater] ✔');
	// c.log('[Updater] v.' + app.getVersion());
	// @endif

	this.tmpDir = undefined;
	this.status = 'no-update';

	this.latest = undefined;
	this.feedURL = 'http://oryoki.io/latest.json';

	this.cleanUp();
	this.checkForUpdate(false);

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

	this.status = 'downloading-update';

	CommandManager.refreshMenus();

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

			this.isDownloading = false;

			if(Oryoki.focusedWindow) {
				Oryoki.focusedWindow.browser.webContents.send('unfreeze-status');
			}

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

			this.createUpdaterScript();
			
		}

	}.bind(this));

}

Updater.prototype.createUpdaterScript = function() {

	var targetPath = app.getAppPath().replace('/Contents/Resources/app', '');
	var sourcePath = this.tmpDir + '/Oryoki.app';

	// Quit current
	var updaterScript = 'killall Oryoki\n';
	// Remove current
	updaterScript += 'rm -rf ' + '\'' + targetPath + '\'' + '\n';
	// Move new
	updaterScript += 'mv ' + '\'' + sourcePath + '\'' + ' ' + '\'' + targetPath + '\'' + '\n';
	// Open new
	updaterScript += 'open ' + '\'' + targetPath + '\'' + '\n';
	// Delete tmp
	updaterScript += 'rm -rf ' + '\'' + this.tmpDir + '\'';

	fs.writeFile(this.tmpDir + '/' + this.latest.version + '-Updater.sh', updaterScript, 'utf8', function(err) {
		
		if(err) throw err;

		// @if NODE_ENV='development'
		c.log('[Updater] Update ready');
		// @endif

		this.status = 'update-ready';
		CommandManager.refreshMenus();

	}.bind(this));

}

Updater.prototype.cleanUp = function() {

	exec('cd ' + '\'' + UserManager.user.paths.tmp + '\'' + ' && rm -rf Update-*', function(error, stdout, stderr) {

		if(error) throw error;

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done cleaning up');
			// @endif

		}

	}.bind(this));

}

Updater.prototype.quitAndInstall = function() {
	
	var updaterScriptPath = this.tmpDir + '/' + this.latest.version + '-Updater.sh';

	// @if NODE_ENV='development'
	c.log('[Updater] Quit and install');
	c.log('[Updater] > sh ' + updaterScriptPath);
	return;
	// @endif

	spawn('sh', [updaterScriptPath], {
		detached: true
	});

}
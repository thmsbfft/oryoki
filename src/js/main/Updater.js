function Updater() {
	
	// @if NODE_ENV='development'
	c.log('[Updater] ✔');
	// c.log('[Updater] v.' + app.getVersion());
	// @endif

	this.tmpDir = undefined;

	this.latest = undefined;
	this.feedURL = 'http://oryoki.io/latest.json';

	this.checkForUpdates();

}

Updater.prototype.checkForUpdates = function() {
	
	// @if NODE_ENV='development'
	c.log('[Updater] Checking for updates...');
	// @endif

	request(this.feedURL, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			this.latest = JSON.parse(body);
			this.compareVersions();
		}
		if(error) {
			// @if NODE_ENV='development'
			c.log('[Updater] ' + error);
			// @endif
		}
	}.bind(this));

}

Updater.prototype.compareVersions = function() {

	var current = Oryoki.versions.oryoki.split('.');
	var suspect = this.latest.version.split('.');

	for(var i=0; i < suspect.length; i++) {
		
		// major.minor.revision

		if(parseInt(suspect[i]) > parseInt(current[i])) {

			// @if NODE_ENV='development'
			c.log('[Updater] Available: ' + this.latest.version);
			// @endif

			this.downloadUpdate();

			break;

		}
	}

}

Updater.prototype.downloadUpdate = function() {

	// @if NODE_ENV='development'
	c.log('[Updater] Downloading update');
	// @endif

	if(Oryoki.focusedWindow) {
		Oryoki.focusedWindow.browser.webContents.send('log-status', {
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

			// exec('open ' + '\'' + this.tmpDir + '/Oryoki.app' + '\'');
			// this.cleanUp();
			
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
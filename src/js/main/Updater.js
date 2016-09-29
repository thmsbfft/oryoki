function Updater() {
	
	// @if NODE_ENV='development'
	c.log('[Updater] ✔');
	// c.log('[Updater] v.' + app.getVersion());
	// @endif

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

	exec('cd ~/Desktop && curl -O ' + this.latest.url, function(error, stdout, stderr) {
		
		if(error) {
			throw error;
		}

		if(error == null) {

			// @if NODE_ENV='development'
			c.log('[Updater] Done downloading!');
			// @endif

		}
	
	}.bind(this));

}

Updater.prototype.quitAndInstall = function() {
	


}
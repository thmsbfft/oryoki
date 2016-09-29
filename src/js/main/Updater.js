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
	
	request(this.feedURL, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			this.latest = JSON.parse(body);
			this.compareVersions();
		}
	}.bind(this));

}

Updater.prototype.compareVersions = function() {

	var current = Oryoki.versions.oryoki.split('.');
	var suspect = this.latest.version.split('.');

	c.log(current);
	c.log(suspect);

	for(var i=0; i < suspect.length; i++) {
		c.log(suspect[i]);
		if(parseInt(suspect[i]) > parseInt(current[i])) {
			c.log('update available');
		}
	}

}

Updater.prototype.quitAndInstall = function() {
	
}
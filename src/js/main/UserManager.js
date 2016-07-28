function UserManager() {

	// Erase comments to validate JSON
	var raw = fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8');
	var re = /\/\/.*/g; // Any line that starts with `//`
	var stripped = raw.replace(re, '');

	this.factory = {
		'preferences' : JSON.parse(stripped)
	}
	
	// We'll only use one user for now.
	this.user = new User('Oryoki', this.factory);

	// Allow for renderer to use preferences
	ipcMain.on('get-preference', function(event, name) {
	  event.returnValue = this.getPreferenceByName(name);
	}.bind(this));

	// Allow for renderer to use user paths
	ipcMain.on('get-user-path', function(event, name) {
		c.log('Returning path: '+this.user.paths[name]);
	  event.returnValue = this.user.paths[name];
	}.bind(this));
}

UserManager.prototype.getPreferenceByName = function(name) {
	/* 
	Checks default user for preference
	If not defined, falls back to factory setting.
	*/
	if(this.user.preferences[name] !== undefined) {
		return this.user.preferences[name];
	}
	else {
		return this.factory.preferences[name];
	}
}

UserManager.prototype.resetUserPreferencesToFactory = function() {
	fs.writeFile(this.user.paths.conf + '/' + 'oryoki-preferences.json', fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8'), function(err) {
		// @if NODE_ENV='development'
		if(err) c.log(err);
		// @endif
		Oryoki.focusedWindow.browser.webContents.send('log-status', {
			'body' : 'Preferences reset'
		});
	});
}

UserManager.prototype.openPreferencesFile = function() {
	shell.openItem(this.user.paths.conf + '/' + 'oryoki-preferences.json');
}
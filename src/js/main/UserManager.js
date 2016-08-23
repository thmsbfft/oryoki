function UserManager() {

	this.factory = {
		'preferences' : this.getFactoryFile('factory.json'),
		'searchDictionary' : this.getFactoryFile('search-dictionary.json')
	}
	
	// We'll only use one user for now.
	this.user = new User('Oryoki', this.factory);

	// Allow for renderer to use preferences
	ipcMain.on('get-preference', function(event, name) {
	  event.returnValue = this.getPreferenceByName(name);
	}.bind(this));

	// Allow for renderer to use user paths
	ipcMain.on('get-user-path', function(event, name) {
		// @if NODE_ENV='development'
		c.log('Returning path: '+this.user.paths[name]);
		// @endif
	  event.returnValue = this.user.paths[name];
	}.bind(this));
}

UserManager.prototype.getFactoryFile = function(fileName) {

	// Erase comments to validate JSON
	var raw = fs.readFileSync(__dirname + '/src/data/' + fileName, 'utf8');
	var re = /(^\/\/|^\t\/\/).*/gm; // Any line that starts with `//` or with a tab followed by `//`
	var stripped = raw.replace(re, '');

	// @if NODE_ENV='development'
	c.log('Getting ' + fileName + ' – ' + JSON.parse(stripped));
	// @endif
	
	return JSON.parse(stripped);

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

UserManager.prototype.reset = function(niceName, fileName, factoryName) {

	fs.writeFile(this.user.paths.conf + '/' + fileName, fs.readFileSync(__dirname + '/src/data/' + factoryName, 'utf8'), function(err) {
		// @if NODE_ENV='development'
		if(err) c.log(err);
		// @endif
		Oryoki.focusedWindow.browser.webContents.send('log-status', {
			'body' : niceName + ' reset'
		});
	});

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
function UserManager() {
	this.factoryPreferences = JSON.parse(fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8'));
	
	// We'll only use one user for now.
	this.user = new User('Oryoki');

	// Allow for renderer to use preferences
	ipcMain.on('get-preference', function(event, name) {
	  console.log(name);
	  event.returnValue = this.getPreferenceByName(name);
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
		return this.factoryPreferences[name];
	}
}

UserManager.prototype.resetUserPreferencesToFactory = function() {
	fs.writeFile(this.user.confPath + '/Oryoki/preferences.json', JSON.stringify(this.factoryPreferences, null, 4), function(err) {
		// @if NODE_ENV='development'
		if(err) c.log(err);
		// @endif
	});
}

UserManager.prototype.openPreferencesFile = function() {
	shell.openItem(this.user.confPath + "/Oryoki/preferences.json");
}
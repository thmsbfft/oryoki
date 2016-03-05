function UserManager() {
	this.factoryPreferences = JSON.parse(fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8'));
	
	// We'll only use one user for now.
	this.user = new User('Oryoki');
}

UserManager.prototype.getPreferenceByName = function(name) {
	/* 
	Checks default user for pref
	If not defined, falls back to factory setting.
	*/
}

UserManager.prototype.resetUserPreferencesToFactory = function() {
	fs.writeFile(this.user.confPath + '/Oryoki/preferences.json', JSON.stringify(this.factoryPreferences, null, 4), function(err) {
		// @if NODE_ENV='development'
		if(err) c.log(err);
		// @endif
	});
}
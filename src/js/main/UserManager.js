function UserManager() {
	this.factoryPreferences = JSON.parse(fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8'));
	this.user = new User('Oryoki');
}

UserManager.prototype.getPreferenceByName = function(name) {
	/* 
	Checks default user for pref
	If not defined, falls back to factory setting.
	*/
}
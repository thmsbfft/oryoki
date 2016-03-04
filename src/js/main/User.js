function User(name) {

	this.name = name;

	// Storing in ~/ for now
	// Will be moved to user's choice
	this.confPath = app.getPath('home');

	this.preferences = undefined;
	this.bookmarks = undefined;
	this.history = undefined;

	this.getPreferences();
}

User.prototype.getPreferences = function() {
	c.log('USER:', this.name);
	this.preferences = this.getConfFile('preferences.json');
	c.log(this.preferences['use_alt_drag']);
}

User.prototype.getConfFile = function(fileName) {
	return JSON.parse(fs.readFileSync(this.confPath + '/Oryoki/' + fileName, 'utf8'));
}
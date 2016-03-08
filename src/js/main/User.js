function User(name) {

	this.name = name;

	// Storing in ~/ for now
	// Will be moved to user's choice
	this.confPath = app.getPath('home');

	this.preferences = undefined;
	this.bookmarks = undefined;
	this.history = undefined;

	this.getPreferences();
	this.watchFile('preferences.json', this.getPreferences.bind(this));
}

User.prototype.getPreferences = function() {
	// @if NODE_ENV='development'
	c.log('USER:', this.name);
	// @endif

	this.preferences = this.getConfFile('preferences.json');
}

User.prototype.watchFile = function(fileName, callback) {
	fs.watch(this.confPath + '/Oryoki/' + fileName, callback);
}

User.prototype.getConfFile = function(fileName) {
	return JSON.parse(fs.readFileSync(this.confPath + '/Oryoki/' + fileName, 'utf8'));
}
function User(name) {

	this.name = name;

	// Storing in ~/Library/Application Support
	this.confPath = app.getPath('appData');

	this.preferences = undefined;
	this.bookmarks = undefined;
	this.history = undefined;

	// Check if Oryoki has data
	fs.access(this.confPath + '/Oryoki/', fs.F_OK, (err) => {
		if(err) {
			c.log('No access!');
			fs.mkdir(this.confPath + '/Oryoki/', 0777, (err) => {
				if (err.code == 'EEXIST') cb(null);
				else c.log(err);
			});
		}
	});


	this.getPreferences();
	this.watchFile('preferences.json', this.getPreferences.bind(this));

}

User.prototype.checkPathforFile = function(fileName, callback) {

	// Check if conf file exists
	// If it doesn't, then callback to create default file

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

	c.log('Getting file...');
	return JSON.parse(fs.readFileSync(this.confPath + '/Oryoki/' + fileName, 'utf8'));

}
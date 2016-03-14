function User(name) {

	this.name = name;

	// Storing in ~/ for now
	// Will be moved to user's choice
	this.confPath = app.getPath('appData');

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
	// fs.access(this.confPath + '/Oryoki/' + fileName, fs.F_OK, (err) => {
	// 	if(err) {
	// 		c.log('Error accessing configuration file: ', err);
	// 		fs.writeFile(this.confPath + '/Oryoki/' + fileName, fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8'), (err) => {
	// 			if (err) c.log(err);
	// 		});
	// 		return JSON.parse(fs.readFileSync(this.confPath + '/Oryoki/' + fileName, 'utf8'));
	// 	}
	// });
}
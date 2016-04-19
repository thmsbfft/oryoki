function User(name, factory) {

	this.name = name;
	this.factory = factory;

	// Storing in ~/Library/Application Support
	this.confPath = app.getPath('appData') + '/' + app.getName() + '/';

	this.preferences = undefined;
	this.bookmarks = undefined;
	this.history = undefined;

	this.getPreferences();
	this.watchFile('preferences.json', this.getPreferences.bind(this));

}

User.prototype.getPreferences = function() {

	this.preferences = this.getConfFile('preferences.json', this.createPreferences.bind(this));

}

User.prototype.watchFile = function(fileName, callback) {

	fs.watch(path.resolve(this.confPath, fileName), callback);

}

User.prototype.getConfFile = function(fileName, callback) {

	try {

		// Check if conf file exists
		fs.statSync(path.resolve(this.confPath, fileName));	

	}
	catch(err) {

		if(err.code === 'ENOENT') {
			// If not, create file
			callback();
			return;
		}
		else {
			throw err;
		}

	}
	finally {

		return JSON.parse(fs.readFileSync(this.confPath + fileName, 'utf8'));

	}

}

User.prototype.createPreferences = function() {

	fs.writeFileSync(this.confPath + 'preferences.json', JSON.stringify(this.factory.preferences, null, 4), 'utf8', (err) => {
		if (err) throw err;
	});

}
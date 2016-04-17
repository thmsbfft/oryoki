function User(name, factory) {

	this.name = name;
	this.factory = factory;

	// Storing in ~/Library/Application Support
	this.confPath = app.getPath('appData') + '/' + app.getName() + '/';

	this.preferences = undefined;
	this.bookmarks = undefined;
	this.history = undefined;

	// Check if Oryoki has data
	fs.accessSync(this.confPath, fs.F_OK, (err) => {
		if(err) {
			// @if NODE_ENV='development'
			c.log('No access!');
			// @endif
			fs.mkdir(this.confPath, 0777, (err) => {
				if (err.code == 'EEXIST') cb(null);
				else c.log(err);
			});
		}
	});

	this.getPreferences();
	// this.watchFile('preferences.json', this.getPreferences.bind(this));

}

User.prototype.getPreferences = function() {

	this.preferences = this.getConfFile('preferences.json', this.createPreferences.bind(this));

}

User.prototype.watchFile = function(fileName, callback) {

	fs.watch(path.resolve(this.confPath, fileName), callback);

}

User.prototype.getConfFile = function(fileName, callback) {

	c.log('Getting file ' + path.resolve(this.confPath, fileName));

	// Check if conf file exists
	// If it doesn't, then callback to create default file

	try {

		fs.statSync(path.resolve(this.confPath, fileName));	

	}
	catch(err) {

		if(err.code === 'ENOENT') {
			// Create file
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

	c.log('Creating preferences...');
	fs.writeFileSync(this.confPath + 'preferences.json', JSON.stringify(this.factory.preferences, null, 4), 'utf8', (err) => {
		if (err) throw err;
	});

}
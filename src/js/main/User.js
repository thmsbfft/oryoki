function User(name, factory) {

	this.name = name;
	this.factory = factory;

	// Storing in ~/Library/Application Support/Oryoki | Electron

	this.confPath = app.getPath('appData') + '/' + app.getName();
	// Check
	try {
		fs.statSync(this.confPath);
	}
	catch(err) {
		if(err.code === 'ENOENT') {
			// @if NODE_ENV='development'
			c.log('Creating App Data directory')
			// @endif
			fs.mkdirSync(this.confPath);
		}
		else {
			throw err;
		}
	}

	this.tmpPath = this.confPath + '/' + 'Temporary';
	// Check
	try {
		fs.statSync(this.tmpPath);
	}
	catch(err) {
		if(err.code === 'ENOENT') {
			// @if NODE_ENV='development'
			c.log('Creating tmp directory');
			// @endif
			fs.mkdirSync(this.tmpPath);
		}
		else {
			throw err;
		}
	}

	this.preferences = undefined;
	this.bookmarks = undefined;
	this.history = undefined;

	this.getPreferences();
	fs.watchFile(this.confPath + '/' + 'preferences.json', this.getPreferences.bind(this));

}

User.prototype.getPreferences = function() {

	this.preferences = this.getConfFile('preferences.json', this.createPreferences.bind(this));

}

User.prototype.getConfFile = function(fileName, callback) {

	// @if NODE_ENV='development'
	c.log('[User] Getting conf file: ' + fileName);
	// @endif

	try {

		// Check if conf file exists
		fs.statSync(this.confPath + '/' + fileName);	

	}
	catch(err) {

		if(err.code === 'ENOENT') {
			// If not, create file
			callback();
		}
		else {
			throw err;
		}
	}
	finally {

		return JSON.parse(fs.readFileSync(this.confPath + '/' + fileName, 'utf8'));

	}

}

User.prototype.createPreferences = function() {

	fs.writeFileSync(this.confPath + '/' + 'preferences.json', JSON.stringify(this.factory.preferences, null, 4), 'utf8', (err) => {
		if (err) throw err;
	});

}
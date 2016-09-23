function User(name, factory) {

	this.name = name;
	this.factory = factory;
	this.paths = {};

	// Storing in ~/Library/Application Support/Oryoki | Electron

	this.paths.conf = app.getPath('appData') + '/' + app.getName();
	// Check App Data dir
	try {
		fs.statSync(this.paths.conf);
	}
	catch(err) {
		if(err.code === 'ENOENT') {
			// @if NODE_ENV='development'
			c.log('[User] Creating App Data directory')
			// @endif
			fs.mkdirSync(this.paths.conf);
		}
		else {
			throw err;
		}
	}

	this.paths.tmp = this.paths.conf + '/' + 'Temporary';
	// Check Temporary dir
	try {
		fs.statSync(this.paths.tmp);
	}
	catch(err) {
		if(err.code === 'ENOENT') {
			// @if NODE_ENV='development'
			c.log('[User] Creating tmp directory');
			// @endif
			fs.mkdirSync(this.paths.tmp);
		}
		else {
			throw err;
		}
	}

	// Load files or create them from factory if they don't exist
	this.preferences = this.getConfFile('oryoki-preferences.json', this.createPreferences.bind(this));;
	this.searchDictionary = this.getConfFile('search-dictionary.json', this.createSearchDictionary.bind(this));

	// Watch files for changes
	fs.watchFile(this.paths.conf + '/' + 'oryoki-preferences.json', this.onPreferencesChange.bind(this));

	fs.watchFile(this.paths.conf + '/' + 'search-dictionary.json', function() {

		this.onSearchDictionaryChange();

		if(Oryoki.focusedWindow) {
			Oryoki.focusedWindow.browser.webContents.send('log-status', {
				'body' : 'Dictionary updated'
			});
		}

	}.bind(this));

	// Init conf file
	this.onPreferencesChange();
	this.onSearchDictionaryChange();

}

User.prototype.onSearchDictionaryChange = function() {

	// @if NODE_ENV='development'
	c.log('[User] Search dictionary has changed');
	// @endif
	this.searchDictionary = this.getConfFile('search-dictionary.json', this.createSearchDictionary.bind(this));

	// Update accross all windows
	if(Oryoki.focusedWindow) {
		for (var i = 0; i < Oryoki.windows.length; i++) {
			Oryoki.windows[i].updateConfFiles();
		}
	}

}

User.prototype.onPreferencesChange = function() {

	// @if NODE_ENV='development'
	c.log('[User] Preferences have changed');
	// @endif

	this.preferences = this.getConfFile('oryoki-preferences.json', this.createPreferences.bind(this));
	
	/* WEB PLUGINS */

	if(this.getPreferenceByName('web_plugins_path') != "") {
		// Path is set
		this.paths.webPlugins = this.getPreferenceByName('web_plugins_path');
	}
	else {
		this.paths.webPlugins = this.paths.conf + '/' + 'Web Plugins';
	}

	// Check Web Plugins paths
	try {
		fs.statSync(this.paths.webPlugins);
	}
	catch(err) {
		if(err.code === 'ENOENT') {
			// @if NODE_ENV='development'
			c.log('[User] Creating web plugins directory');
			// @endif
			fs.mkdirSync(this.paths.webPlugins);
		}
		else {
			throw err;
		}
	}

	/* PICTURE IN PICTURE */

	if(Oryoki.focusedWindow) {
		Oryoki.focusedWindow.browser.setFullScreenable(!this.getPreferenceByName('picture_in_picture'));
	}

}

User.prototype.getConfFile = function(fileName, callback) {

	// @if NODE_ENV='development'
	c.log('[User] Getting conf file: ' + fileName);
	// @endif

	try {

		// Erase comments to validate JSON
		var raw = fs.readFileSync(this.paths.conf + '/' + fileName, 'utf8');
		var re = /(^\/\/|^\t\/\/).*/gm; // Any line that starts with `//` or with a tab followed by `//`
		var stripped = raw.replace(re, '');

		return JSON.parse(stripped);	

	}
	catch(err) {

		// @if NODE_ENV='development'
		c.log('[User] Error getting ' + fileName + ' : ' + err);
		// @endif

		if(err.code === 'ENOENT') {
			// @if NODE_ENV='development'
			c.log('[User] Creating file: ' + fileName);
			// @endif
			callback();
			return;
		}
		else {
			throw err;
		}
	}

}

User.prototype.createPreferences = function() {

	fs.writeFileSync(this.paths.conf + '/' + 'oryoki-preferences.json', fs.readFileSync(__dirname + '/src/data/factory.json', 'utf8'));

}

User.prototype.createSearchDictionary = function() {

	fs.writeFileSync(this.paths.conf + '/' + 'search-dictionary.json', fs.readFileSync(__dirname + '/src/data/search-dictionary.json', 'utf8'));

}

User.prototype.getPreferenceByName = function(name) {
	/* 
	Checks user for preference
	If not defined, falls back to factory setting.
	*/
	if(this.preferences[name] !== undefined) {
		return this.preferences[name];
	}
	else {
		return this.factory.preferences[name];
	}
}
function StatusManager(parameters) {

	console.log('[StatusManager] ☑️');

	this.id = window.location.hash.substring(1);
	this.el = document.getElementsByTagName('status')[0];
	this.history = [];
	
	this.isVisible = false;
	this.isFrozen = false;
	this.visibilityTimer = null;

	ipcRenderer.on('log-status', function(e, props) {
		this.log(props);
	}.bind(this));

	ipcRenderer.on('hide-status', this.hide.bind(this));
	ipcRenderer.on('show-status', this.show.bind(this));

}

StatusManager.prototype.log = function(props) {

	// Stop logging stuff if an error is displayed
	if(this.isFrozen) return;

	this.el.innerHTML = props.body;
	this.el.className = 'fade-in';

	clearTimeout(this.visibilityTimer);
	this.visibilityTimer = setTimeout(this.fadeOut.bind(this), 1200);

}

StatusManager.prototype.error = function(props) {

	this.el.innerHTML = '<icon>' + '⚠️' + '</icon>' + props.body;
	this.el.className = 'fade-in error';

	this.freeze();

}

StatusManager.prototype.freeze = function() {

	clearTimeout(this.visibilityTimer);
	this.isFrozen = true;

}

StatusManager.prototype.unFreeze = function() {

	this.isFrozen = false;
	this.visibilityTimer = setTimeout(this.fadeOut.bind(this), 1200);

}

StatusManager.prototype.fadeOut = function() {

	this.el.className = 'fade-out';

}

StatusManager.prototype.hide = function() {

	this.isVisible = false;
	this.el.className = 'disabled';

}

StatusManager.prototype.show = function() {

	this.isVisible = true;
	this.el.className = '';

}
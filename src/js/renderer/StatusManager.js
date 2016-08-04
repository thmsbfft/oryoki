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

	ipcRenderer.on('error-status', function(e, props) {
		this.error(props);
	}.bind(this));

	ipcRenderer.on('hide-status', this.hide.bind(this));
	ipcRenderer.on('show-status', this.show.bind(this));

}

StatusManager.prototype.log = function(props) {

	// Stop logging stuff if an error is displayed
	if(this.isFrozen) return;

	if(props.icon) {
		this.el.innerHTML = '<icon>' + props.icon + '</icon>' + props.body;
	}
	else {
		this.el.innerHTML = props.body;
	}

	removeClass(this.el, 'fade-out');
	addClass(this.el, 'fade-in');

	clearTimeout(this.visibilityTimer);
	this.visibilityTimer = setTimeout(this.fadeOut.bind(this), 1200);

}

StatusManager.prototype.error = function(props) {

	this.el.innerHTML = '<icon>' + '⚠️' + '</icon>' + props.body;
	removeClass(this.el, 'fade-out');
	addClass(this.el, 'fade-in');

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

	this.el.innerHTML = '';

	this.isVisible = false;
	addClass(this.el, 'hide');

	this.freeze();

}

StatusManager.prototype.show = function() {

	this.isVisible = true;
	removeClass(this.el, 'hide');

	this.unFreeze();

}
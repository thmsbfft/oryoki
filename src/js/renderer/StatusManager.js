function StatusManager(parameters) {

	console.log('[StatusManager] ☑️');

	this.id = window.location.hash.substring(1);
	this.el = document.getElementsByTagName('status')[0];
	this.history = [];
	
	this.isVisible = true;

	ipcRenderer.on('display-status', function(e, props) {
		this.display(props);
	}.bind(this));

	ipcRenderer.on('hide-status', this.hide.bind(this));
	ipcRenderer.on('show-status', this.show.bind(this));

}

StatusManager.prototype.display = function(props) {

	this.el.innerHTML = props.body;

}

StatusManager.prototype.hide = function() {

	this.isVisible = false;
	this.el.className = 'disabled';

}

StatusManager.prototype.show = function() {

	this.isVisible = true;
	this.el.className = '';

}
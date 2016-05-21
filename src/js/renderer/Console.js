function Console(parameters) {

	this.id = parameters.id;
	this.isVisible = false;

	this.el = document.getElementsByTagName('console')[0];
	this.input = this.el.getElementsByTagName('input')[0];

	this.attachEvents();
	this.hide();

}

Console.prototype.attachEvents = function() {

	this.input.addEventListener('focus', this.clear.bind(this));

	this.input.addEventListener('keyup', function(e) {
		if (e.keyCode == 13) { this.submit(); }
		else if(e.key == "Escape") { 
			this.hide();
			ipcRenderer.send('set-menu-checked', 'Tools', 'Mini Console', false);
		}
	}.bind(this));

	ipcRenderer.on('toggle_mini_console', function(event, windowId) {
		if(windowId == this.id) {
			console.log('toggle_window_helper');
			if(!this.isVisible) this.show();
			else this.hide();
			this.isVisible != this.isVisible;
		}
	}.bind(this));

}

Console.prototype.updateMessage = function(e) {

	this.input.value = e.message;

}

Console.prototype.clear = function() {

	this.input.value = '';

}

Console.prototype.submit = function() {

	Browser.view.webview.executeJavaScript(this.input.value);
	this.clear();

}

Console.prototype.hide = function() {

	this.isVisible = false;
	this.el.className = 'hide';

}

Console.prototype.show = function() {

	this.isVisible = true;
	this.el.className = 'show';
	this.input.focus();

}
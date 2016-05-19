function Console(parameters) {

	this.el = document.getElementsByTagName('console')[0];
	this.input = this.el.getElementsByTagName('input')[0];

	this.attachEvents();
	this.hide();

}

Console.prototype.attachEvents = function() {

	this.input.addEventListener('focus', this.clear.bind(this));
	this.input.addEventListener('keyup', function(e) {
		if (e.keyCode == 13) { this.submit(); }
		else if(e.key == "Escape") { this.hide(); }
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

	this.el.className = 'hide';

}

Console.prototype.show = function() {

	this.el.className = 'show';
	this.input.focus();

}
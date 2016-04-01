function Console(parameters) {

	this.el = document.getElementsByTagName('console')[0];
	this.hide();
	
}

Console.prototype.updateMessage = function(e) {

	this.el.innerHTML = e.message;

}

Console.prototype.hide = function() {

	this.el.className = 'hide';

}

Console.prototype.show = function() {

	this.el.className = 'show';

}
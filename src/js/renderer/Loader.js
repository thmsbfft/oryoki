function Loader(parameters) {

	this.el = document.querySelectorAll('#loader')[0];

	console.log('Loader');

	this.show();
}

Loader.prototype.loading = function() {
	addClass(this.el, 'loading');
}

Loader.prototype.reset = function() {
	this.el.className = 'show';
}

Loader.prototype.hide = function() {
	this.el.className = 'hide';
}

Loader.prototype.show = function() {
	this.el.className = 'show';
}
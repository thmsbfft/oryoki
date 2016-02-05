function Loader(parameters) {

	this.el = document.querySelectorAll('#loader')[0];

	console.log('Loader');

	this.hide();
}

Loader.prototype.loading = function() {
	this.show();
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
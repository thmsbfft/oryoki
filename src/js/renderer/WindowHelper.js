function WindowHelper(parameters) {

	this.el = document.getElementsByTagName('windowHelper')[0];

	console.log('Window Helper');

	window.addEventListener('resize', this.updateWindowDimensions.bind(this));

	// this.hide();
	this.show();
}

WindowHelper.prototype.updateWindowDimensions = function() {

	this.el.querySelectorAll('#width')[0].placeholder = window.innerWidth;
	this.el.querySelectorAll('#height')[0].placeholder = window.innerHeight;

}

WindowHelper.prototype.hide = function() {
	this.el.className = 'hide';
}

WindowHelper.prototype.show = function() {
	this.el.className = 'show';
}
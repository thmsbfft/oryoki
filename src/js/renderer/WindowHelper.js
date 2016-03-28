function WindowHelper(parameters) {

	this.el = document.getElementsByTagName('windowHelper')[0];

	console.log('Window Helper');

	window.addEventListener('resize', this.updateWindowDimensions.bind(this));

	// this.hide();
	this.updateWindowDimensions();
	this.show();
}

WindowHelper.prototype.updateWindowDimensions = function() {

	var newWidth = document.querySelectorAll('#frame')[0].offsetWidth;
	var newHeight = document.querySelectorAll('#frame')[0].offsetHeight;
	console.log(newHeight);

	if(newWidth >= 1000) {
		addClass(this.el.querySelectorAll('#width')[0], 'fourDigits');
	}
	else {
		removeClass(this.el.querySelectorAll('#width')[0], 'fourDigits');		
	}

	this.el.querySelectorAll('#width')[0].value = newWidth;

	if(newHeight >= 1000) {
		addClass(this.el.querySelectorAll('#height')[0], 'fourDigits');
	}
	else {
		removeClass(this.el.querySelectorAll('#height')[0], 'fourDigits');		
	}	

	this.el.querySelectorAll('#height')[0].value = newHeight;

}

WindowHelper.prototype.hide = function() {
	this.el.className = 'hide';
}

WindowHelper.prototype.show = function() {
	this.el.className = 'show';
}
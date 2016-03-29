function WindowHelper(parameters) {

	this.id = parameters.id;
	this.isVisible = undefined;
	this.el = document.getElementsByTagName('windowHelper')[0];

	this.widthInput = this.el.querySelectorAll('#width')[0];
	this.heightInput = this.el.querySelectorAll('#height')[0];

	console.log('Window Helper');

	window.addEventListener('resize', this.updateWindowDimensions.bind(this));

	this.attachEvents();
	this.updateWindowDimensions();
	this.hide();
}

WindowHelper.prototype.attachEvents = function() {

	// IPC
	ipcRenderer.on('hide_window_helper', function(event, windowId) {
		if(windowId == this.id) {
			this.hide();
		}
	}.bind(this));

	ipcRenderer.on('show_window_helper', function(event, windowId) {
		if(windowId == this.id) {
			this.show();
		}
	}.bind(this));

	ipcRenderer.on('toggle_window_helper', function(event, windowId) {
		if(windowId == this.id) {
			console.log('toggle_window_helper');
			if(!this.isVisible) this.show();
			else this.hide();
			this.isVisible != this.isVisible;
		}
	}.bind(this));

	this.widthInput.addEventListener('click', function() {
		this.select();
	});

	this.heightInput.addEventListener('click', function() {
		this.select();
	});

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
	console.log('Hiding');
	this.isVisible = false;
	this.el.className = 'hide';
}

WindowHelper.prototype.show = function() {
	console.log('Showing');
	this.isVisible = true;
	this.el.className = 'show';
}
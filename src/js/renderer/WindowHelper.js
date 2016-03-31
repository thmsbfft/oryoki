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

	this.el.addEventListener('keyup', function(e) {
		this.onInputKeyUp(e);
	}.bind(this));

}

WindowHelper.prototype.updateWindowDimensions = function() {

	this.widthInput.value = document.querySelectorAll('#frame')[0].offsetWidth;
	this.heightInput.value = document.querySelectorAll('#frame')[0].offsetHeight;

	this.updateUI();

}

WindowHelper.prototype.updateUI = function() {

	if(this.widthInput.value >= 1000) {
		addClass(this.el.querySelectorAll('#width')[0], 'fourDigits');
	}
	else {
		removeClass(this.el.querySelectorAll('#width')[0], 'fourDigits');		
	}

	if(this.heightInput.value >= 1000) {
		addClass(this.el.querySelectorAll('#height')[0], 'fourDigits');
	}
	else {
		removeClass(this.el.querySelectorAll('#height')[0], 'fourDigits');		
	}	

}

WindowHelper.prototype.hide = function() {

	this.isVisible = false;
	this.el.className = 'hide';

}

WindowHelper.prototype.show = function() {

	this.isVisible = true;
	this.el.className = 'show';

}

WindowHelper.prototype.onInputKeyUp = function(e) {

	console.log(e);

	switch(e.keyCode) {

		case 38:
			// Arrow Up
			break;

		case 40:
			// Arrow Down
			break;

		case 9:
			// Tab
			break;

		case 13:
			// Enter Key
			this.requestNewWindowDimensions(
				this.widthInput.value, this.heightInput.value
			);
			break;

	}

	this.updateUI();

}

WindowHelper.prototype.requestNewWindowDimensions = function(width, height) {

	console.log('Resizing to: ' + width + 'x' + height);

}

WindowHelper.prototype.slider = function(e, direction) {

	// TODO need a new name

	switch(direction) {

		case 'up':
			if(e.shiftKey) {
				// Increment by 10
			}
			else {
				// Increment by 1
			}
			break;

		case 'down':
			if(e.shiftKey) {
				// Decrement by 10
			}
			else {
				// Decrement by 1
			}
			break;

	}

}
function WindowHelper(parameters) {

	this.id = parameters.id;
	this.isVisible = undefined;
	this.el = document.getElementsByTagName('windowHelper')[0];

	this.widthInput = this.el.querySelectorAll('#width')[0];
	this.heightInput = this.el.querySelectorAll('#height')[0];

	console.log('[Window Helper] ☑️');

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

	ipcRenderer.on('update_window_dimensions', function(event, windowId) {
		if(windowId == this.id) {
			this.updateWindowDimensions();
		}
	}.bind(this));

	// Basic
	this.widthInput.addEventListener('click', function() {
		this.select();
	});

	this.heightInput.addEventListener('click', function() {
		this.select();
	});

	this.el.addEventListener('keyup', function(e) {
		this.onInputKeyUp(e);
	}.bind(this));

	this.el.addEventListener('keydown', function(e) {
		this.onInputKeyDown(e);
	}.bind(this));

}

WindowHelper.prototype.updateWindowDimensions = function() {

	this.widthInput.value = window.innerWidth;
	this.heightInput.value = window.innerHeight;

	this.updateUI();

}

WindowHelper.prototype.updateUI = function() {

	if(this.widthInput.value <= 1000) {
		this.el.querySelectorAll('#width')[0].className = '';
	}

	if(this.heightInput.value <= 1000) {
		this.el.querySelectorAll('#height')[0].className = '';
	}

	if(this.widthInput.value >= 1000) {
		this.el.querySelectorAll('#width')[0].className = 'leadingOne';
	}

	if(this.heightInput.value >= 1000) {
		this.el.querySelectorAll('#height')[0].className = 'leadingOne';
	}

	if(this.widthInput.value >= 2000) {
			this.el.querySelectorAll('#width')[0].className = 'fourDigits';
	}

	if(this.heightInput.value >= 2000) {
		this.el.querySelectorAll('#height')[0].className = 'fourDigits';
	}

}

WindowHelper.prototype.hide = function() {

	this.isVisible = false;
	this.el.className = 'hide';

}

WindowHelper.prototype.show = function() {

	this.isVisible = true;
	this.el.className = 'show';

	this.widthInput.select();

}

WindowHelper.prototype.onInputKeyUp = function(e) {

	if(e.key == "Escape") {

		this.hide();
		if(Browser.omnibox.isVisible) Browser.omnibox.focus();
		ipcRenderer.send('set-menu-checked', 'Window', 'Window Helper', false);

	}

	// Ignore letters and keys we use later on
	if(e.key.match(/[a-z]/i) && e.key.length == 1 || e.keyCode == 9) e.preventDefault();

	switch(e.keyCode) {

		case 9:
			// Tab
			if(e.target.id == 'width') this.heightInput.select();
			else this.widthInput.select();
			break;

		case 13:
			// Enter
			this.requestNewWindowDimensions(
				this.widthInput.value, this.heightInput.value
			);
			break;

	}

	this.updateUI();

}

WindowHelper.prototype.onInputKeyDown = function(e) {

	// Ignore letters and keys we use later on
	if(e.metaKey == false && e.key.match(/[a-z]/i) && e.key.length == 1 || e.keyCode == 9 || e.keyCode == 38 || e.keyCode == 40) e.preventDefault();

	switch(e.keyCode) {

		case 38:
			// Arrow Up
			this.increment(e, 'up');
			e.target.select();
			break;

		case 40:
			// Arrow Down
			this.increment(e, 'down');
			e.target.select();
			break;

	}

	this.updateUI();

}

WindowHelper.prototype.requestNewWindowDimensions = function(width, height) {

	console.log('Resizing to: ' + width + 'x' + height);
	ipcRenderer.send('setWindowSize', parseInt(width), parseInt(height), this.id);

}

WindowHelper.prototype.increment = function(e, direction) {

	switch(direction) {

		case 'up':
			if(e.shiftKey) {
				e.target.value = parseInt(e.target.value) + 10;
			}
			else {
				e.target.value = parseInt(e.target.value) + 1;
			}
			break;

		case 'down':
			if(e.shiftKey) {
				e.target.value = parseInt(e.target.value) - 10;
			}
			else {
				e.target.value = parseInt(e.target.value) - 1;
			}
			break;

	}

}
function Omnibox(parameters) {

	this.isVisible = undefined;

	this.modes = {
		'url' : 'Search',
		'lucky' : 'Lucky'
	};

	this.modeIndex = 0;
	this.mode = Object.keys(this.modes)[this.modeIndex];

	this.el = document.getElementsByTagName('omnibox')[0];
	this.htmlData = undefined;
	this.submitCallback = parameters.onsubmit;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.input = this.el.querySelectorAll('.input')[0];
	this.overlay = this.el.querySelectorAll('.overlay')[0];

	this.input.setAttribute('placeholder', this.modes[this.mode]); // Gets the nice name for mode

	this.attachEvents();
	
	console.log('[Omnibox] Created Omnibox');
	this.show();

}

Omnibox.prototype.attachEvents = function() {

	this.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
	this.input.addEventListener('keyup', this.onInputKeyUp.bind(this));
	this.input.addEventListener('copy', this.onCopy.bind(this));
	this.input.addEventListener('cut', this.onCopy.bind(this));

	// Always keep the omnibox in focus
	this.overlay.addEventListener('mousedown', function(e) {
		this.focus();
		e.preventDefault();
	}.bind(this));

}

Omnibox.prototype.onInputKeyDown = function(e) {

	if(e.keyCode == 9) {
		// Tab
	}
	if(e.keyCode == 13) {
		// Enter
		addClass(this.input, 'highlight');
		e.preventDefault();
	}

}

Omnibox.prototype.onInputKeyUp = function(e) {

	if(e.keyCode == 9) {
		// Tab
	}
	if(e.keyCode == 13) {
		// Enter
		removeClass(this.input, 'highlight');
		this.submit();
		e.preventDefault();
	}
	if(e.key == "Escape") {
		if(!Browser.isFirstLoad) this.hide()
	}

}

Omnibox.prototype.onCopy = function(e) {

	console.log('[OMNIBOX] Copy');

	var selectionRangeLength = window.getSelection().toString().length;

	if(selectionRangeLength == this.input.value.length && selectionRangeLength != 0) {
		
		// If all input is selected
		// copy full URL from webview
		if(Browser.view.webview.getAttribute('src') != null) {

			clipboard.writeText(Browser.view.webview.getAttribute('src'));
			if(e.type == 'cut') this.input.value = '';
			e.preventDefault();

		}
	}

}

Omnibox.prototype.submit = function() {

	var raw = this.input.innerText;
	var output = null;

	var domain = new RegExp(/[a-z]+(\.[a-z]+)+/ig);
	var port = new RegExp(/(:[0-9]*)\w/g);

	if(this.mode == 'url') {
		if(domain.test(raw) || port.test(raw)) {
			// This is a domain
			if (!raw.match(/^[a-zA-Z]+:\/\//))
			{
			    output = 'http://' + raw;
			}
			else {
				output = raw;
			}
		}
		else {
			// This is not a domain
			output = 'https://www.google.com/ncr?gws_rd=ssl#q=' + raw;
		}
	}
	else if(this.mode == 'lucky') {
		output = 'http://www.google.com/search?q=' + raw + '&btnI';
	}

	this.submitCallback(output);

}

Omnibox.prototype.switchMode = function() {

	this.input.value = '';
	this.modeIndex++;
	if(this.modeIndex >= Object.keys(this.modes).length) {
		this.modeIndex = 0;
	}
	this.mode = Object.keys(this.modes)[this.modeIndex];

	this.input.setAttribute('placeholder', this.modes[this.mode]); // Gets the nice name for mode

}

Omnibox.prototype.show = function() {

	this.isVisible = true;
	if (Browser.view) {
		this.input.value = Browser.view.webview.getAttribute('src').split('://')[1];
	}
	removeClass(this.el, 'hide');
	addClass(this.el, 'show');
	this.focus();
	this.selectAll();
	ipcRenderer.send('setOmniboxShow');

}

Omnibox.prototype.hide = function() {

	this.isVisible = false;
	removeClass(this.el, 'show');
	addClass(this.el, 'hide');
	ipcRenderer.send('setOmniboxHide');

}

Omnibox.prototype.isFocus = function() {

	return this.input === document.activeElement;

}

Omnibox.prototype.focus = function() {

	this.input.focus();

}

Omnibox.prototype.selectAll = function() {

	this.input.focus();
	document.execCommand('selectAll', false, null);

}
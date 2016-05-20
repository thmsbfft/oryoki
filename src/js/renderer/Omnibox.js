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

	console.log('Omnibox!');

	this.isTabDown = false;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.input = this.el.querySelectorAll('.input')[0];
	this.tab = this.el.querySelectorAll('.tab')[0];
	this.overlay = this.el.querySelectorAll('.overlay')[0];

	this.input.setAttribute('placeholder', this.modes[this.mode]); // Gets the nice name for mode

	this.attachEvents();
	this.show();

}

Omnibox.prototype.attachEvents = function() {

	this.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
	this.input.addEventListener('keyup', this.onInputKeyUp.bind(this));
	this.tab.addEventListener('click', this.switchMode.bind(this));

	// Always keep the omnibox in focus
	this.overlay.addEventListener('mousedown', function(e) {
		this.focus();
		e.preventDefault();
	}.bind(this));

}

Omnibox.prototype.onInputKeyDown = function(e) {
	if(!e) var e = window.event;
	// console.log(e.keyCode);
	if(e.keyCode == 9) {
		if(!this.isTabDown) this.switchMode();
		addClass(this.tab, 'active');
		this.isTabDown = true;
		e.preventDefault();
	}
	if(e.keyCode == 13) {
		addClass(this.input, 'highlight');
	}
}

Omnibox.prototype.onInputKeyUp = function(e) {
	if(e.keyCode == 9) {
		this.isTabDown = false;
		removeClass(this.tab, 'active');
	}
	if(e.keyCode == 13) {
		removeClass(this.input, 'highlight');
		this.submit();
	}
	if(e.key == "Escape") {
		if(!Browser.isFirstLoad) this.hide()
	}
}

Omnibox.prototype.submit = function() {

	var raw = this.el.querySelectorAll('input')[0].value;
	var output = null;

	var domain = new RegExp(/[a-z]+(\.[a-z]+)+/ig);
	var port = new RegExp(/(:[0-9]*)\w/g);

	if(this.mode == 'url') {
		if(domain.test(raw) || port.test(raw)) {
			// console.log('This is a domain!');
			if (!raw.match(/^[a-zA-Z]+:\/\//))
			{
			    output = 'http://' + raw;
			}
			else {
				output = raw;
			}
		}
		else {
			// console.log('This is not a domain!');
			output = 'https://www.google.com/ncr?gws_rd=ssl#q=' + raw;
		}
	}
	else if(this.mode == 'lucky') {
		output = 'http://www.google.com/search?q=' + raw + '&btnI';
	}

	this.submitCallback(output);
}

Omnibox.prototype.switchMode = function() {
	console.log('Switching mode');
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
	removeClass(this.el, 'hide');
	addClass(this.el, 'show');
	this.focus();
	this.el.querySelectorAll('input')[0].select();
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
	this.el.querySelectorAll('input')[0].focus();
}
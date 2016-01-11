function Omnibox(parameters) {

	this.modes = {
		'url' : 'Search',
		'lucky' : 'Lucky',
		'wikipedia' : 'Wikipedia',
		'stackoverflow' : 'Stackoverflow'
	};
	this.modeIndex = 0;
	this.mode = Object.keys(this.modes)[this.modeIndex];

	this.el = document.querySelectorAll('#omnibox')[0];
	this.htmlData = undefined;
	console.log(this.mode);
	this.submitCallback = parameters.onsubmit;

	console.log('Omnibox!');

	this.isTabDown = false;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.input = document.querySelectorAll('#omnibox .input')[0];
	this.tab = document.querySelectorAll('#omnibox .tab')[0];

	this.input.setAttribute('placeholder', this.modes[this.mode]); // Gets the nice name for mode

	this.attachEvents();
	this.setLow();
	this.show();
}

Omnibox.prototype.attachEvents = function() {
	this.el.querySelectorAll('input')[0].addEventListener('keydown', this.onKeyDown.bind(this));
	this.el.querySelectorAll('input')[0].addEventListener('keyup', this.onKeyUp.bind(this));
}

Omnibox.prototype.onKeyDown = function(e) {
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

Omnibox.prototype.onKeyUp = function(e) {
	if(e.keyCode == 9) {
		this.isTabDown = false;
		removeClass(this.tab, 'active');
	}
	if(e.keyCode == 13) {
		removeClass(this.input, 'highlight');
		this.submit();
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
	else if(this.mode == 'stackoverflow') {
		output = 'http://stackoverflow.com/search?q=' + raw;
	}
	else if(this.mode == 'wikipedia') {
		output = 'https://en.wikipedia.org/w/index.php?search=' + raw;
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
	removeClass(this.el, 'hide');
	addClass(this.el, 'show');
	this.focus();
	ipcRenderer.send('setOmniboxShow');
}

Omnibox.prototype.hide = function() {
	removeClass(this.el, 'show');
	addClass(this.el, 'hide');
	ipcRenderer.send('setOmniboxHide');
}

Omnibox.prototype.focus = function() {
	this.el.querySelectorAll('input')[0].focus();
}

Omnibox.prototype.setHigh = function() {
	removeClass(this.el, 'handle');
	addClass(this.el, 'nohandle');
}

Omnibox.prototype.setLow = function() {
	removeClass(this.el, 'nohandle');
	addClass(this.el, 'handle');}

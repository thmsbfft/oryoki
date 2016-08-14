function Omnibox(parameters) {

	this.isVisible = undefined;

	this.searchDictionary = undefined;

	this.el = document.getElementsByTagName('omnibox')[0];
	this.htmlData = undefined;
	this.submitCallback = parameters.onsubmit;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.input = this.el.querySelectorAll('.input')[0];
	this.overlay = this.el.querySelectorAll('.overlay')[0];

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

	ipcRenderer.on('update-search-dictionary', this.updateSearchDictionary.bind(this));

}

Omnibox.prototype.updateSearchDictionary = function(e, dictionary) {

	this.searchDictionary = dictionary;

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

	var keyword = this.getKeyword();

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

	var customSearch = this.getCustomSearch();

	if (customSearch == null) {

		// Is this a domain?
		if(domain.test(raw) || port.test(raw)) {
			if (!raw.match(/^[a-zA-Z]+:\/\//))
			{
			    output = 'http://' + raw;
			}
			else {
				output = raw;
			}
		}
		else {
			// Use default search engine
			output = this.searchDictionary.default.replace('{query}', raw);
		}

	}
	else {

		// Use custom search
		var keyword = /(.)+? /i;
		var query = raw.replace(keyword.exec(raw)[0], '');

		output = customSearch.url.replace('{query}', query);

	}

	this.submitCallback(output);

}

Omnibox.prototype.getKeyword = function() {

	var raw = this.input.innerText;
	var keyword = raw.split(" ")[0].trim();
	
	// Look for a match
	var match = this.searchDictionary.custom.filter(function(search) {
		return search.keyword == keyword
	}.bind(this));

	// Return the match
	if(match.length == 0) {
		return null;
	}
	else {
		return match[0];
	}

}

Omnibox.prototype.getCustomSearch = function() {

	var raw = this.input.innerText;
	
	// If there's only one word, return null
	if(raw.split(" ").length <= 1) return null;

	// Get keyword
	var re = /(.)+? /i; // match until first space character, including space
	var res = re.exec(raw);
	res = res[0].substring(0, res[0].length - 1); // erase space
	
	// Look for a match
	var match = this.searchDictionary.custom.filter(function(search) {
		return search.keyword == res
	}.bind(this));

	// Return the match
	if(match.length == 0) {
		return null;
	}
	else {
		return match[0];
	}

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
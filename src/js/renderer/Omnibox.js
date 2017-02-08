function Omnibox(parameters) {

	this.isVisible = undefined;

	this.searchDictionary = undefined;

	this.el = document.getElementsByTagName('omnibox')[0];
	this.htmlData = undefined;
	this.submitCallback = parameters.onsubmit;

	this.htmlData = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'html', 'omnibox.html'), 'utf8');
	this.el.innerHTML = this.htmlData;
	this.input = this.el.querySelectorAll('.input')[0];
	this.hints = this.el.querySelectorAll('.hints')[0];
	this.overlay = this.el.querySelectorAll('.overlay')[0];

	this.updateClue = document.createElement('div');
	this.updateClue.className = 'updateClue';
	this.input.parentNode.insertBefore(this.updateClue, this.input.nextSibling);

	this.dragCount = 0;

	this.attachEvents();
	
	console.log('[Omnibox] Created Omnibox');
	this.hideHints();
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

	this.hints.addEventListener('mousedown', function(e) {
		this.focus();
		console.log('Hint mousedown');
		e.preventDefault();
	}.bind(this));

	ipcRenderer.on('update-search-dictionary', this.updateSearchDictionary.bind(this));

	ipcRenderer.on('update-ready', this.onUpdateReady.bind(this));
	ipcRenderer.on('downloading-update', this.onUpdateDownload.bind(this));
	ipcRenderer.on('update-available', this.onUpdateAvailable.bind(this));

	this.el.ondragover = (e) => {
		e.preventDefault();
	}

	this.el.ondragenter = (e) => {

		// console.log(e.dataTransfer.files[0].path);
		this.dragCount++;
		addClass(this.input, 'drop');
		e.preventDefault();

	}

	this.el.ondragleave = (e) => {

		this.dragCount--;
		if(this.dragCount === 0) removeClass(this.input, 'drop');
		e.preventDefault();

	}

	this.el.ondrop = (e) => {

		removeClass(this.input, 'drop');
		this.dragCount = 0;
		ipcRenderer.send('open-file', Browser.id, e.dataTransfer.files[0].path);
		e.preventDefault();

	}

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
	if(e.keyCode == 32) {
		// Space bar
		// this.input.innerHTML += '<space></space>';
		// e.preventDefault();
	}

}

Omnibox.prototype.onInputKeyUp = function(e) {

	if(e.ctrlKey && e.keyCode == 13 && this.searchDictionary.direct) {

		// Ctrl + Enter
		var raw = this.input.value;
		var url = this.searchDictionary.direct.replace('{query}', raw);
		this.submitCallback(url);
		StatusManager.log({
			'body' : 'Looking for ' + raw,
		});
		e.preventDefault();
		return;

	}

	if(e.keyCode == 13) {

		// Enter
		removeClass(this.input, 'highlight');
		this.submit();
		e.preventDefault();

	}
	
	if(e.key == "Escape") {
	
		if(!Browser.isFirstLoad) this.hide();
	
	}

	var customSearch = this.getCustomSearch();

	if(customSearch != null) {

		// Show hints
		this.showHints(customSearch);

	}
	else {

		this.hideHints();

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

	var raw = this.input.value;
	var output = null;

	var domain = new RegExp(/[a-z]+(\.[a-z]+)+/ig);
	var port = new RegExp(/(:[0-9]*)\w/g);

	var customSearch = this.getCustomSearch();

	if (customSearch == null || customSearch[0].isComplete == undefined) {

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
	else if(customSearch[0].isComplete) {

		// Use custom search
		var keyword = customSearch[0].keyword;
		var query = raw.replace(keyword, '');

		if(query.trim().length == 0) {
			// If custom search doesn't have a parameter,
			// use default URL
			output = this.searchDictionary.default.replace('{query}', raw);
		}
		else {
			console.log('[OMNIBOX] Search URL:', customSearch[0].url);
			output = customSearch[0].url.replace('{query}', query.trim());
			console.log(output);
		}

	}

	this.submitCallback(output);

}

Omnibox.prototype.getCustomSearch = function() {

	var raw = this.input.value;
	var keyword = raw.split(" ")[0].trim();
	
	// Empty omnibox doesn't count
	if(keyword.trim().length == 0) return null;

	// Look for a complete match
	var completeMatch = this.searchDictionary.custom.filter(function(search) {
		return search.keyword == keyword
	}.bind(this));

	if (completeMatch.length > 0) {
		console.log('Complete match:', completeMatch[0].keyword);
		completeMatch[0].isComplete = true; // Flag the match as a complete match
		return completeMatch;
	}

	// Look for potential matches
	var potentialMatches = this.searchDictionary.custom.filter(function(search) {
		return search.keyword.includes(keyword)
	}.bind(this));

	console.log('Potential matches:', potentialMatches.length);

	if(potentialMatches.length == 0) {
		// No matches
		return null;
	}
	else {
		return potentialMatches;
	}

}

Omnibox.prototype.show = function() {

	this.isVisible = true;
	if (Browser.view) {
		this.hideHints();
		this.input.innerHTML = Browser.view.webview.getAttribute('src').split('://')[1];
	}
	removeClass(this.el, 'hide');
	addClass(this.el, 'show');

	if(Browser.handle) Browser.handle.el.classList.remove('stroke');

	this.focus();
	this.selectAll();
	ipcRenderer.send('setOmniboxShow');

}

Omnibox.prototype.hide = function() {

	this.isVisible = false;
	removeClass(this.el, 'show');
	addClass(this.el, 'hide');

	if(Browser.handle) Browser.handle.el.classList.add('stroke');

	ipcRenderer.send('setOmniboxHide');

}

Omnibox.prototype.showHints = function(searchArray) {

	this.hints.innerHTML = '';

	var raw = this.input.value;
	var keyword = raw.split(" ")[0].trim();

	for (var i = 0; i < searchArray.length; i++) {
		
		var hint = document.createElement('hint');
		hint.innerHTML = searchArray[i].hint;

		this.hints.appendChild(hint);

		var keywordEl = '<span class="keyword">' + searchArray[i].keyword + '</span>';
		hint.innerHTML += keywordEl;

		if(searchArray[i].keyword == keyword) {
			addClass(hint.getElementsByClassName('keyword')[0], 'highlighted');
		}

	};

	addClass(this.input, 'hintShown');

	removeClass(this.hints, 'hide');
	addClass(this.hints, 'show');

}

Omnibox.prototype.hideHints = function() {

	this.hints.innerHTML = '';
	
	removeClass(this.input, 'hintShown');

	removeClass(this.hints, 'show');
	addClass(this.hints, 'hide');

}

Omnibox.prototype.onUpdateAvailable = function(e, latest) {

	this.updateClue.className = 'updateClue available';

	this.updateClue.innerHTML = "Update available (" + latest.version + ')';

	this.updateClue.addEventListener('click', this.ipcSendDownloadUpdate);

}

Omnibox.prototype.ipcSendDownloadUpdate = function() {

	ipcRenderer.send('download-update');

}

Omnibox.prototype.onUpdateDownload = function(e, latest) {

	this.updateClue.removeEventListener('click', this.ipcSendDownloadUpdate);

	this.updateClue.className = 'updateClue downloading';
	this.updateClue.innerHTML = 'Downloading';

}

Omnibox.prototype.onUpdateReady = function(e, latest) {

	this.updateClue.className = 'updateClue ready';

	this.updateClue.innerHTML = "Update to " + latest.version;

	this.updateClue.addEventListener('click', function() {
		ipcRenderer.send('quit-and-install');
	});

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
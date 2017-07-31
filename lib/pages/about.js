// styles
require('../sass/bundle.scss')

// oryoki
const {remote} = require('electron')
const {app} = require('electron').remote
const rpc = require('../utils/rpc')
const windows = remote.require('./windows')

rpc.on('ready', function (e, uid) {
  console.log('[rpc] ✔', rpc.id)

  let handleEl = document.querySelector('handle');
  let closeEl = handleEl.querySelector('.button.close');

  closeEl.addEventListener('click', function() {
    rpc.emit('about:hide');
  });

  let versionEl = document.querySelector('.version');
  versionEl.innerHTML = 'Version ' + app.getVersion();

  let notesLinkEl = document.querySelector('.notes a');
  notesLinkEl.setAttribute('href', 'https://github.com/thmsbfft/oryoki/releases/tag/' + app.getVersion());

  notesLinkEl.addEventListener('click', function(e) {
    windows.create(e.target.getAttribute('href'))
    rpc.emit('about:hide')
    e.preventDefault();
  });
})
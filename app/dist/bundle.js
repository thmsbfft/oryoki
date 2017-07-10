/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// Packages
const {remote, ipcRenderer} = __webpack_require__(0)
const config = remote.require('./config')

// Styles
__webpack_require__(2)

// Oryoki
const rpc = __webpack_require__(7)
const handle = __webpack_require__(8)

rpc.on('ready', function (e, uid) {
  console.log('[rpc] ✔', rpc.id)
  handle.init()
})


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./bundle.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./bundle.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/* http://meyerweb.com/eric/tools/css/reset/ \n   v2.0 | 20110126\n   License: none (public domain)\n*/\nhtml, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline; }\n\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\n  display: block; }\n\nbody {\n  line-height: 1; }\n\nol, ul {\n  list-style: none; }\n\nblockquote, q {\n  quotes: none; }\n\nblockquote:before, blockquote:after {\n  content: '';\n  content: none; }\n\nq:before, q:after {\n  content: '';\n  content: none; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\n@keyframes blink {\n  0% {\n    border-color: #00ec91; }\n  50% {\n    border-color: rgba(0, 236, 145, 0.6); } }\n\n@keyframes pulse {\n  0% {\n    opacity: 1; }\n  50% {\n    opacity: 0; } }\n\n@keyframes fade-in {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes fade-out {\n  0% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@keyframes appear {\n  0% {\n    box-shadow: inset 0 0 0 3px rgba(52, 130, 220, 0); }\n  100% {\n    box-shadow: inset 0 0 0 3px rgba(52, 130, 220, 0.7); } }\n\nbody {\n  background-color: #141414;\n  font-family: -apple-system, BlinkMacSystemFont, sans-serif;\n  color: white;\n  overflow: hidden;\n  -webkit-font-smoothing: antialiased; }\n\ncursor {\n  z-index: 99;\n  position: fixed;\n  width: 10px;\n  height: 10px;\n  background: red;\n  border-radius: 10px;\n  pointer-events: none; }\n  cursor.active {\n    background: blue; }\n\nhandle {\n  -webkit-app-region: drag;\n  background: rgba(20, 20, 20, 0);\n  height: 24px;\n  width: 100%;\n  text-align: center;\n  transition: background 0.2s;\n  display: block; }\n  handle.stroke::after {\n    content: ' ';\n    width: 100%;\n    height: 1px;\n    background: #212121;\n    display: inline-block;\n    position: fixed;\n    top: 24px;\n    left: 0;\n    z-index: 98;\n    transition: background 0.1s; }\n  handle .title {\n    margin-top: 0px;\n    padding: 0 8px;\n    padding-top: 4px;\n    padding-bottom: 6px;\n    text-align: center;\n    font-size: 15px;\n    line-height: 14px;\n    letter-spacing: -0.5px;\n    display: inline-block;\n    -webkit-app-region: no-drag;\n    -webkit-user-select: none;\n    user-select: none;\n    cursor: pointer;\n    background: transparent;\n    border-radius: 20px;\n    transition: background 0.1s; }\n    handle .title.selected {\n      background: rgba(255, 255, 255, 0.15); }\n      handle .title.selected::after {\n        opacity: 1; }\n    handle .title::after {\n      width: 9px;\n      height: 9px;\n      position: relative;\n      top: -1px;\n      content: '\\2022';\n      display: inline-block;\n      margin-left: 4px;\n      opacity: 0.2;\n      transition: opacity 0.2s; }\n    handle .title:hover::after {\n      opacity: 1; }\n    handle .title.align-left {\n      text-align: left;\n      position: absolute;\n      left: 60px; }\n  handle .button {\n    position: absolute;\n    -webkit-app-region: no-drag;\n    user-select: none;\n    top: 6px;\n    border-radius: 100%;\n    height: 12px;\n    width: 12px;\n    transition: background-color 0.1s;\n    -webkit-box-sizing: border-box; }\n    handle .button::after {\n      content: '';\n      display: block;\n      margin-left: 3px;\n      margin-top: 3px;\n      height: 6px;\n      width: 6px;\n      border-radius: 100%;\n      background: transparent;\n      transition: background-color 0.1s; }\n    handle .button:hover::after {\n      background: rgba(0, 0, 0, 0.3); }\n  handle .close {\n    left: 9px;\n    background: #fc5b57; }\n    handle .close:active {\n      background: #CC443F; }\n  handle .minimize {\n    left: 29px;\n    background: rgba(255, 255, 255, 0.2);\n    transition: background 0.2s; }\n  handle .fullscreen {\n    left: 49px;\n    background: rgba(255, 255, 255, 0.2);\n    transition: background 0.2s; }\n  handle.hide {\n    display: none; }\n  handle:hover .minimize, handle.light:hover .minimize {\n    background: #ffbb3c; }\n    handle:hover .minimize:active, handle.light:hover .minimize:active {\n      background: #CC9631; }\n  handle:hover .fullscreen, handle.light:hover .fullscreen {\n    background: #35c849; }\n    handle:hover .fullscreen:active, handle.light:hover .fullscreen:active {\n      background: #269435; }\n  handle.disabled .button {\n    background: rgba(255, 255, 255, 0.2); }\n  handle.disabled .title {\n    opacity: 0.6; }\n  handle.light {\n    background: #f7f7f7; }\n    handle.light.stroke::after {\n      background: rgba(33, 33, 33, 0.15); }\n    handle.light .title {\n      color: #1a1a1a; }\n    handle.light .minimize {\n      background: rgba(0, 0, 0, 0.15); }\n    handle.light .fullscreen {\n      background: rgba(0, 0, 0, 0.15); }\n    handle.light.disabled .button {\n      background: rgba(0, 0, 0, 0.15); }\n\n#view {\n  width: 100%;\n  height: 100%; }\n  #view.recording::before {\n    content: '';\n    width: 10px;\n    height: 10px;\n    background: transparent;\n    border-radius: 10px;\n    position: absolute;\n    top: 20px;\n    right: 20px;\n    animation: pulse 0.8s infinite; }\n\nomnibox {\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  -webkit-app-region: drag;\n  z-index: 98; }\n  omnibox .box {\n    z-index: 98;\n    max-width: 485px;\n    top: calc(50px);\n    position: relative;\n    margin: auto; }\n    omnibox .box ::-webkit-input-placeholder {\n      color: rgba(255, 255, 255, 0.2); }\n    omnibox .box .input {\n      z-index: 98;\n      -webkit-app-region: no-drag;\n      width: calc(100% - 24px);\n      font-size: 22px;\n      letter-spacing: -0.5px;\n      color: white;\n      background: #2b2b2b;\n      line-height: 21px;\n      outline: none;\n      border: none;\n      padding: 6px 12px;\n      position: relative;\n      border-radius: 1px;\n      transition: background-color 0.1s ease-out;\n      box-shadow: 0px 0px 0px 2px transparent;\n      transition: box-shadow 0.1s ease-out;\n      white-space: nowrap;\n      overflow-x: scroll; }\n      omnibox .box .input::-webkit-scrollbar {\n        display: none; }\n      omnibox .box .input.highlight {\n        background-color: #1F1F1F; }\n      omnibox .box .input.drop {\n        box-shadow: 0px 0px 0px 2px rgba(53, 130, 220, 0.7); }\n      omnibox .box .input::selection {\n        background-color: rgba(255, 255, 255, 0.1); }\n      omnibox .box .input.hintShown {\n        border-bottom-left-radius: 0;\n        border-bottom-right-radius: 0; }\n  omnibox .hints {\n    z-index: 98;\n    display: block;\n    max-width: 485px;\n    margin: auto;\n    font-size: 14px;\n    letter-spacing: -0.4px;\n    background: #1A1A1A;\n    position: relative;\n    border-radius: 0px 0px 2px 2px;\n    color: rgba(255, 255, 255, 0.4);\n    -webkit-user-select: none;\n    cursor: default; }\n    omnibox .hints.hide {\n      display: none; }\n    omnibox .hints.show {\n      display: block; }\n    omnibox .hints hint {\n      padding: 14px;\n      display: block; }\n      omnibox .hints hint .keyword {\n        float: right;\n        letter-spacing: -0.1px;\n        color: rgba(255, 255, 255, 0.4); }\n      omnibox .hints hint .highlighted {\n        color: rgba(255, 255, 255, 0.6); }\n  omnibox.show {\n    display: block; }\n  omnibox.hide {\n    display: none; }\n  omnibox .overlay {\n    width: 100%;\n    height: 100%;\n    background-color: #141414;\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 88; }\n  omnibox .updateClue {\n    background: #1A1A1A;\n    padding: 7px 14px;\n    margin-bottom: 10px;\n    font-size: 12px;\n    letter-spacing: -0.4px;\n    display: inline-block;\n    color: rgba(255, 255, 255, 0.4);\n    -webkit-user-select: none;\n    cursor: default;\n    border-bottom-right-radius: 10px;\n    border-bottom-left-radius: 10px;\n    transition: 0.3s color;\n    display: none; }\n    omnibox .updateClue::before {\n      content: '';\n      width: 4px;\n      height: 4px;\n      border-radius: 4px;\n      display: inline-block;\n      background: green;\n      margin-right: 8px;\n      position: relative;\n      top: -2px;\n      display: none; }\n    omnibox .updateClue:hover {\n      color: white; }\n    omnibox .updateClue:active {\n      background-color: #1F1F1F; }\n    omnibox .updateClue.available {\n      display: inline-block; }\n      omnibox .updateClue.available::before {\n        background: red; }\n    omnibox .updateClue.downloading {\n      display: inline-block; }\n      omnibox .updateClue.downloading:hover {\n        color: rgba(255, 255, 255, 0.4); }\n      omnibox .updateClue.downloading:active {\n        background: #1A1A1A; }\n      omnibox .updateClue.downloading::before {\n        background: rgba(255, 255, 255, 0.8);\n        display: inline-block;\n        animation: pulse 1s infinite; }\n    omnibox .updateClue.ready {\n      display: inline-block; }\n      omnibox .updateClue.ready::before {\n        background: green;\n        display: inline-block; }\n\n@media (max-width: 485px) {\n  omnibox .box {\n    top: 4px;\n    width: calc(100% - 8px); }\n    omnibox .box .input {\n      border-radius: 2px; } }\n\nstatus {\n  position: fixed;\n  top: 0;\n  right: 0;\n  text-align: right;\n  padding: 5px 8px;\n  font-size: 12.5px;\n  display: inline-block;\n  letter-spacing: -0.1px;\n  line-height: 14px;\n  text-rendering: optimizeLegibility;\n  color: rgba(255, 255, 255, 0.8);\n  background: rgba(40, 40, 40, 0.7);\n  pointer-events: none;\n  border-bottom-left-radius: 6px;\n  opacity: 0;\n  transition: opacity 0.5s ease-out;\n  z-index: 99; }\n  status icon {\n    padding-right: 7px;\n    position: relative;\n    top: 0.5px;\n    color: white; }\n  status.hide {\n    display: none; }\n  status.fade-in {\n    opacity: 1;\n    transition: opacity 0.5s ease-out; }\n  status.fade-out {\n    opacity: 0;\n    transition: opacity 1s ease-in; }\n  status i {\n    font-style: italic; }\n  status.light {\n    background: rgba(40, 40, 40, 0.1);\n    color: rgba(0, 0, 0, 0.8); }\n  @media (-webkit-min-device-pixel-ratio: 2) {\n    status icon {\n      padding-right: 5px; } }\n\nconsole {\n  position: fixed;\n  bottom: 0;\n  background: #252525;\n  width: calc(100% - 10px);\n  padding-left: 10px;\n  padding-top: 4px;\n  height: 19px;\n  font-family: 'Roboto Mono Regular', sans-serif;\n  font-size: 12px;\n  color: rgba(255, 255, 255, 0.6);\n  display: none; }\n  console.show {\n    display: block; }\n  console.hide {\n    display: none; }\n  console input {\n    -webkit-app-region: no-drag;\n    width: calc(100% - 36px - 55px);\n    color: rgba(255, 255, 255, 0.7);\n    background: #252525;\n    line-height: 11px;\n    letter-spacing: 0.5px;\n    outline: none;\n    border: none;\n    position: relative;\n    padding-right: 79px;\n    border-radius: 2px;\n    transition: background-color 0.1s ease-out; }\n    console input.highlight {\n      background-color: #1F1F1F; }\n    console input::selection {\n      background-color: rgba(255, 255, 255, 0.2); }\n\nwindowhelper {\n  position: fixed;\n  z-index: 99;\n  bottom: 18px;\n  right: 18px;\n  background: #212121;\n  padding: 3px 7px;\n  border-radius: 2px;\n  text-align: center;\n  color: rgba(255, 255, 255, 0.6);\n  display: none; }\n  windowhelper.show {\n    display: block; }\n  windowhelper.hide {\n    display: none; }\n  windowhelper::focus {\n    background: #262626; }\n  windowhelper input {\n    font-size: 13px;\n    letter-spacing: 0px;\n    color: rgba(255, 255, 255, 0.6);\n    background: transparent;\n    width: 26px;\n    display: inline-block;\n    line-height: 19px;\n    outline: none;\n    border: none;\n    padding: 0;\n    transition: background-color 0.1s ease-out;\n    text-align: center; }\n    windowhelper input.fourDigits {\n      width: 34px; }\n    windowhelper input.leadingOne {\n      width: 30px; }\n    windowhelper input:focus {\n      color: white;\n      background: transparent; }\n    windowhelper input::selection {\n      color: white;\n      background: transparent; }\n  windowhelper #width {\n    text-align: right; }\n  windowhelper #height {\n    text-align: left; }\n  windowhelper .separator {\n    color: rgba(255, 255, 255, 0.4);\n    display: inline-block;\n    width: 8px;\n    position: relative;\n    left: -0.5px;\n    text-align: center;\n    -webkit-user-select: none;\n    user-select: none; }\n\n@media (-webkit-min-device-pixel-ratio: 2) {\n  windowhelper input.fourDigits {\n    width: 34px; }\n  windowhelper input.leadingOne {\n    width: 33px; } }\n\n#dragOverlay {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 999;\n  background: transparent;\n  pointer-events: none;\n  display: none;\n  box-shadow: inset 0 0 0 3px rgba(52, 130, 220, 0);\n  -webkit-app-region: drag; }\n  #dragOverlay.active {\n    display: block;\n    pointer-events: all;\n    box-shadow: inset 0 0 0 3px rgba(52, 130, 220, 0);\n    animation: appear 0.1s ease-in;\n    animation-delay: 0.1s;\n    -webkit-animation-fill-mode: forwards; }\n  #dragOverlay.invisible {\n    opacity: 0; }\n\n.webview {\n  height: 100%;\n  width: 100%;\n  background: white;\n  transition: 0.4s filter;\n  filter: grayscale(0%) invert(0%); }\n  .webview.show {\n    animation: fade-in 0.15s ease-out; }\n  .webview.hide {\n    opacity: 0; }\n  .webview.grayscale {\n    filter: grayscale(100%) invert(0%); }\n  .webview.invert {\n    filter: grayscale(0%) invert(100%); }\n  .webview.grayscale.invert {\n    filter: grayscale(100%) invert(100%); }\n\n.homepage {\n  -webkit-app-region: drag;\n  height: 100%;\n  width: 100%;\n  position: fixed; }\n  .homepage .infos {\n    position: fixed;\n    bottom: 45px;\n    left: 50px; }\n  .homepage p {\n    margin-bottom: 0;\n    margin-top: 0;\n    font-family: 'Roboto Light', sans-serif;\n    font-size: 18px;\n    color: rgba(255, 255, 255, 0.3);\n    line-height: 24px; }\n\nbody.about {\n  background-color: #333333; }\n  body.about main {\n    -webkit-app-region: drag;\n    width: 100%;\n    height: 90%;\n    position: absolute;\n    top: 0;\n    left: 0;\n    text-align: center;\n    padding-top: 10%;\n    color: rgba(255, 255, 255, 0.7); }\n    body.about main img {\n      width: 150px;\n      margin-bottom: 25px;\n      animation: fade-in 0.3s ease-out; }\n    body.about main h1 {\n      color: white;\n      font-size: 20px;\n      font-weight: 400;\n      margin-bottom: 10px; }\n    body.about main p.version {\n      color: rgba(255, 255, 255, 0.7);\n      font-size: 13px;\n      line-height: 1.4;\n      display: inline; }\n    body.about main p.author {\n      text-align: center;\n      position: absolute;\n      bottom: 25px;\n      width: 100%;\n      font-size: 13px;\n      color: rgba(255, 255, 255, 0.7); }\n    body.about main p.notes {\n      display: inline;\n      font-size: 13px; }\n      body.about main p.notes a {\n        color: rgba(255, 255, 255, 0.7);\n        text-decoration: none;\n        outline: none;\n        cursor: default; }\n        body.about main p.notes a:hover {\n          text-decoration: underline; }\n  body.about handle {\n    -webkit-app-region: drag;\n    background: transparent;\n    height: 24px;\n    text-align: center;\n    z-index: 99;\n    position: absolute; }\n    body.about handle::after {\n      display: none; }\n    body.about handle .button {\n      position: absolute;\n      -webkit-app-region: no-drag;\n      user-select: none;\n      top: 6px;\n      border-radius: 100%;\n      height: 12px;\n      width: 12px;\n      transition: background-color 0.1s;\n      -webkit-box-sizing: border-box;\n      background: transparent;\n      border: 1px solid rgba(255, 255, 255, 0.2); }\n      body.about handle .button:hover::after {\n        display: none; }\n    body.about handle .close {\n      left: 9px;\n      background: #fc5b57;\n      border: none; }\n      body.about handle .close:active {\n        background: #CC443F; }\n      body.about handle .close::after {\n        content: '';\n        display: block;\n        margin-left: 3px;\n        margin-top: 3px;\n        height: 6px;\n        width: 6px;\n        border-radius: 100%;\n        background: transparent;\n        transition: background-color 0.1s; }\n      body.about handle .close:hover::after {\n        display: block;\n        background: rgba(0, 0, 0, 0.3); }\n    body.about handle.disabled .button {\n      background: rgba(255, 255, 255, 0.2); }\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(6);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

// from: https://github.com/zeit/hyper/blob/master/lib/utils/rpc.js

class RPC {
  constructor () {
    const electron = window.require('electron')
    const EventEmitter = window.require('events')
    this.emitter = new EventEmitter()
    this.ipc = electron.ipcRenderer
    this.ipcListener = this.ipcListener.bind(this)
    if (window.__rpcId) {
      setTimeout(() => {
        this.id = window.__rpcId
        this.ipc.on(this.id, this.ipcListener)
        this.emitter.emit('ready')
      }, 0)
    } else {
      this.ipc.on('init', (ev, uid) => {
        // we cache so that if the object
        // gets re-instantiated we don't
        // wait for a `init` event
        window.__rpcId = uid
        this.id = uid
        this.ipc.on(uid, this.ipcListener)
        this.emitter.emit('ready')
      })
    }
  }

  ipcListener (event, {ch, data}) {
    this.emitter.emit(ch, data)
  }

  on (ev, fn) {
    this.emitter.on(ev, fn)
  }

  once (ev, fn) {
    this.emitter.once(ev, fn)
  }

  emit (ev, data) {
    if (!this.id) {
      throw new Error('Not ready')
    }
    this.ipc.send(this.id, {ev, data})
    console.log('[rpc]', ev, data)
  }

  removeListener (ev, fn) {
    this.emitter.removeListener(ev, fn)
  }

  removeAllListeners () {
    this.emitter.removeAllListeners()
  }

  destroy () {
    this.removeAllListeners()
    this.ipc.removeAllListeners()
  }
}

module.exports = new RPC()


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const {remote, ipcRenderer} = __webpack_require__(0)
const config = remote.require('./config')
const rpc = __webpack_require__(7)

let el
let titleEl

var title = 'Ōryōki'
var isShown = config.getPreference('show_title_bar')
var isDisabled = false

function init () {
  el = document.querySelector('handle')
  titleEl = el.querySelector('.title')

  el.querySelector('.button.close').addEventListener('click', () => {
    remote.getCurrentWindow().close()
  })

  el.querySelector('.button.minimize').addEventListener('click', () => {
    remote.getCurrentWindow().minimize()
  })

  el.querySelector('.button.fullscreen').addEventListener('click', () => {
    remote.getCurrentWindow().setFullScreen(true)
    hide()
  })

  ipcRenderer.on('toggle-handle', toggle)

  ipcRenderer.on('test', () => {
    console.log('hello?')
  })

  if (isShown) show()
  else hide()
  console.log('[handle] ✔')
}

function show () {
  el.classList.remove('hide')
  win = remote.getCurrentWindow()
  win.setSize(
    win.getSize()[0],
    win.getSize()[1] + 24
  )
  isShown = true
}

function hide () {
  el.classList.add('hide')
  win = remote.getCurrentWindow()
  win.setSize(
    win.getSize()[0],
    win.getSize()[1] - 24
  )
  isShown = false
}

function toggle () {
  if (isShown) hide()
  else show()
}

function disable () {
  el.classList.add('disabled')
  isDisabled = true
}

function enable () {
  el.classList.remove('disabled')
  isDisabled = false
}

function updateTitle (newTitle) {
  titleEl.setAttribute('title', newTitle)
  title = newTitle
  titleEl.innerText = newTitle
  remote.getCurrentWindow().setTitle(newTitle)
}

module.exports = {
  init: init,
  show: show,
  hide: hide,
  updateTitle: updateTitle
}


/***/ })
/******/ ]);
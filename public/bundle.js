/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Messenger = function () {
  function Messenger($messages) {
    _classCallCheck(this, Messenger);

    console.log('### Messenger object is created. ###');
    this.$messages = $messages;
  }

  _createClass(Messenger, [{
    key: 'appendLog',
    value: function appendLog(msg) {
      this.$messages.append($('<li class="log">').text(msg));
      this._scrollDown();
    }
  }, {
    key: 'appendMyMessage',
    value: function appendMyMessage(user, msg) {
      this.$messages.append($('<li>').html('<span class="label label-success">' + user + '</span> ' + msg));
      this._scrollDown();
    }
  }, {
    key: 'appendYourMessage',
    value: function appendYourMessage(user, msg) {
      this.$messages.append($('<li>').html('<span class="label label-default">' + user + '</span> ' + msg));
      this._scrollDown();
    }
  }, {
    key: 'appendTyping',
    value: function appendTyping(user) {
      this.$messages.append($('<li class="log">').html(user + ' is typing...').data('user', user));
      this._scrollDown();
    }
  }, {
    key: 'removeTyping',
    value: function removeTyping(user) {
      var msgToRemove = this._getTypingMessages(user);
      msgToRemove.fadeOut(function () {
        $(msgToRemove).remove();
      });
    }
  }, {
    key: '_getTypingMessages',
    value: function _getTypingMessages(user) {
      return $('.log').filter(function (index, element) {
        return $(element).data('user') === user;
      });
    }
  }, {
    key: '_scrollDown',
    value: function _scrollDown() {
      this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
    }
  }]);

  return Messenger;
}();

exports.default = Messenger;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _messenger = __webpack_require__(0);

var _messenger2 = _interopRequireDefault(_messenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPING_TIMER_LENGTH = 400; // ms

var messenger = void 0;
var socket = void 0;
var typing = false;

$(function () {
  messenger = new _messenger2.default($('#messages'));
  addEventListeners();
  setSocketIo();
});

function setSocketIo() {
  socket = io();

  socket.on('login', function (data) {
    messenger.appendLog('Welcome, ' + data.username + '! (' + data.numUsers + ')');
  });

  socket.on('user joined', function (data) {
    messenger.appendLog(data.username + ' joined. (' + data.numUsers + ')');
  });

  socket.on('user left', function (data) {
    messenger.appendLog(data.username + ' left. (' + data.numUsers + ')');
  });

  socket.on('chat message', function (data) {
    messenger.appendYourMessage(data.username, data.message);
  });

  socket.on('typing', function (data) {
    messenger.appendTyping(data.username);
  });

  socket.on('stop typing', function (data) {
    messenger.removeTyping(data.username);
  });

  socket.on('disconnect', function () {
    messenger.appendLog('You have been disconnected.');
  });

  socket.on('reconnect', function () {
    messenger.appendLog('You have been reconnected.');
    login();
  });
}

function addEventListeners() {
  var $input = $('#inputMessage');
  $input.on('input', function () {
    monitorTyping();
  });

  $('#formChat').submit(function () {
    chat();
    return false;
  });

  $('#formLogin').submit(function () {
    login();
    return false;
  });
}

function monitorTyping() {
  if (!typing) {
    typing = true;
    socket.emit('typing');
  }

  var lastTypingTime = new Date().getTime();

  setTimeout(function () {
    var typingTimer = new Date().getTime();
    var timeDiff = typingTimer - lastTypingTime;
    if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
      socket.emit('stop typing');
      typing = false;
    }
  }, TYPING_TIMER_LENGTH);
}

function chat() {
  messenger.appendMyMessage($('#inputUsername').val(), $('#inputMessage').val());
  socket.emit('chat message', $('#inputMessage').val());
  $('#inputMessage').val('');
}

function login() {
  var $input = $('#inputUsername');
  var username = $input.val().trim();

  if (username) {
    $('#loginPage').fadeOut();
    $('#loginPage').off('click');
    $('#chatPage').show();
    $('#inputMessage').focus();

    socket.emit('add user', username);
  }
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
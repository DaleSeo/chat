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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TYPING_TIMER_LENGTH = 400; // ms

var socket = void 0;
var username = void 0;
var typing = false;

$(function () {
  initialize();
});

function initialize() {
  var $input = $('#inputMessage');
  $input.on('input', function () {
    monitorTyping();
  });

  setSocketIo();
  addKeyEvent();
  addSubmitEvent();
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

function setSocketIo() {
  socket = io();

  socket.on('login', function (data) {
    appendLog('Welcome, ' + data.username + '! (' + data.numUsers + ')');
  });

  socket.on('user joined', function (data) {
    appendLog(data.username + ' joined. (' + data.numUsers + ')');
  });

  socket.on('user left', function (data) {
    appendLog(data.username + ' left. (' + data.numUsers + ')');
  });

  socket.on('chat message', function (data) {
    addYourMessage(data.username, data.message);
  });

  socket.on('typing', function (data) {
    showTyping(data.username);
  });

  socket.on('stop typing', function (data) {
    hideTyping(data.username);
  });

  socket.on('disconnect', function () {
    appendLog('You have been disconnected.');
  });

  socket.on('reconnect', function () {
    appendLog('You have been reconnected.');
    login();
  });
}

function addKeyEvent() {
  var $input = $('#inputUsername');
  $(window).keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $input.focus();
    }
  });
}

function addSubmitEvent() {
  $('#formChat').submit(function () {
    chat();
    return false;
  });

  $('#formLogin').submit(function () {
    login();
    return false;
  });
}

function login() {
  var $input = $('#inputUsername');
  var username = $input.val().trim();

  if (username) {
    $('#loginPage').fadeOut();
    $('#chatPage').show();
    $('#loginPage').off('click');

    socket.emit('add user', username);
  }
}

function chat() {
  addMyMessage($('#inputUsername').val(), $('#inputMessage').val());
  socket.emit('chat message', $('#inputMessage').val());
  $('#inputMessage').val('');
}

function appendLog(msg) {
  var $messages = $('#messages');
  $messages.append($('<li class="log">').text(msg));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function addMyMessage(user, msg) {
  var $messages = $('#messages');
  $messages.append($('<li>').html('<span class="label label-success">' + user + '</span> ' + msg));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function addYourMessage(user, msg) {
  var $messages = $('#messages');
  $messages.append($('<li>').html('<span class="label label-default">' + user + '</span> ' + msg));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function showTyping(user) {
  var $messages = $('#messages');
  $messages.append($('<li class="log">').html(user + ' is typing...').data('user', user));
  $messages[0].scrollTop = $messages[0].scrollHeight;
}

function hideTyping(user) {
  getTypingMessages(user).fadeOut(function () {
    $(this).remove();
  });
}

function getTypingMessages(user) {
  return $('.log').filter(function (i) {
    return $(this).data('user') === user;
  });
}

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
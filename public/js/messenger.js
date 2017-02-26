import $ from 'jquery';

export default class Messenger {

  constructor($messages) {
    this.$messages = $messages;
  }

  setUsername(username) {
    this.username = username;
  }

  appendLog(msg) {
    this.$messages.append($('<li class="log">').text(msg));
    this._scrollDown();
  }

  appendMessage(user, msg) {
    let className = this.username && this.username === user ? 'label-success' : 'label-default';
    this.$messages.append($('<li>').html(`<span class="label ${className}">${user}</span> ${msg}`));
    this._scrollDown();
  }

  appendMyMessage(user, msg) {
    this.$messages.append($('<li>').html(`<span class="label label-success">${user}</span> ${msg}`));
    this._scrollDown();
  }

  appendYourMessage(user, msg) {
    this.$messages.append($('<li>').html(`<span class="label label-default">${user}</span> ${msg}`));
    this._scrollDown();
  }

  appendDirectMessage(user, msg) {
    this.$messages.append($('<li>').html(`<span class="label label-warning">${user}</span> ${msg}`));
    this._scrollDown();
  }

  appendTyping(user) {
    this.$messages.append($('<li class="log">').html(`${user} is typing...`).data('user', user));
    this._scrollDown();
  }

  removeTyping(user) {
    let msgToRemove = this._getTypingMessages(user);
    msgToRemove.fadeOut(() => {
      $(msgToRemove).remove();
    });
  }

  _getTypingMessages(user) {
    return $('.log').filter((index, element) => {
      return $(element).data('user') === user;
    });
  }

  _scrollDown() {
    this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
  }

}

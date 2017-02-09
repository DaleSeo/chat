export default class Messenger {

  constructor($messages) {
    console.log('### Messenger object is created. ###');
    this.$messages = $messages;
  }

  appendLog(msg) {
    this.$messages.append($('<li class="log">').text(msg));
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

  appendTyping(user) {
    this.$messages.append($('<li class="log">').html(`${user} is typing...`).data('user', user));
    this._scrollDown();
  }

  removeTyping(user) {
    this._getTypingMessages(user).fadeOut(() => {
      $(this).remove();
    });
  }

  _getTypingMessages(user) {
    return $('.log').filter((i) => {
      return $(this).data('user') === user;
    });
  }

  _scrollDown() {
    this.$messages[0].scrollTop = this.$messages[0].scrollHeight;
  }

}

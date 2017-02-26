const fs = require('fs');
const path = require('path');

const FILE_NAME = path.join(__dirname, '../messages.dat');

class Repository {

  insert(message, callback) {
    this.findAll((err, messages) => {
      messages.push(message);
      fs.writeFile(FILE_NAME, JSON.stringify(messages), 'utf8', (err) => {
        callback(err);
      });
    });
  }

  findAll(callback) {
    fs.readFile(FILE_NAME, 'utf8', (err, messages) => {
      callback(err, JSON.parse(messages));
    });
  }

}

module.exports = Repository;

const fs = require('fs');
const path = require('path');

const FILE_NAME = path.join(__dirname, '../messages.dat');

class Repository {

  findAll(callback) {
    fs.readFile(FILE_NAME, 'utf8', (err, messages) => {
      console.log(messages);
      callback(err, JSON.parse(messages));
    });
  }

}

module.exports = Repository;

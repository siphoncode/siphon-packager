
'use strict';

var request = require('superagent');

var SERVER_CONSTANTS = require('./constants').SERVER;
var BASE_VERSION = require('./constants').REACT_NATIVE_VERSION;

// This provides us with a simple interface for interacting with the packager
// server

class Client {
  getFooter(projectPath) {
    var r = new Promise(function(resolve, reject) {
      var url = 'http://' + SERVER_CONSTANTS.HOSTNAME + ':'
                + SERVER_CONSTANTS.PORT;
      request
        .get(url)
        .query({projectPath: projectPath, version: BASE_VERSION})
        .end(function(error, response) {
          if (response && response.ok) {
            var r = JSON.parse(response.text);
            if (r.error) {
              reject(new Error(r.error));
            } else {
              resolve(r.result);
            }
          } else {
            reject(new Error('Internal error'));
          }
        });
    });

    return r;
  }
}

module.exports = Client;

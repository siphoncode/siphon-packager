'use strict';

var http = require('http');
var url = require('url');
var path = require('path');

var SERVER_CONSTANTS = require('./constants');

// When started, this will listen for get requests including the porject-path
// as a parameter and return an appropriate response

class Server {
  start() {
    console.log('Starting up...');
    var server = http.createServer(this._handleRequest.bind(this));
    server.listen(SERVER_CONSTANTS.PORT, SERVER_CONSTANTS.HOSTNAME, () => {
      console.log('Packager running');
    });
  }

  _handleRequest(request, response) {
    var parsed = url.parse(request.url, true);
    var version = parsed.query.version;
    var minify = parsed.query.minify != undefined ? true : false;
    var platform = parsed.query.platform;
    var entryPath = parsed.query.entryPath;
    var outputPath = parsed.query.outputPath;

    // version < 0.4
    var projectPath = parsed.query.projectPath;
    if (!entryPath) {
      var entryPath = path.join(projectPath, 'index.ios.js');
    }

    var packagerLocation = './versions/' + version + '/siphon/packager/packager';
    var Packager = require('./versions/' + version +
                               '/siphon/packager/packager');
    var appName = path.dirname(entryPath);

    // Return {"result": "footer code", "error": "error message"}
    var jsonResponse = {
      result: '',
      error: '',
    };
    var start = new Date();
    var opts = {
      entryPath: entryPath,
      minify: minify,
      platform: platform,
      outputPath: outputPath,
    };

    try {
      var p = new Packager(opts);
      var outputPath = p.buildFooter();
      jsonResponse.result = outputPath;

      response.end(JSON.stringify(jsonResponse));

      var end = new Date();
      console.log('Footer built for ' + appName + ' app in ' +
                  (end - start) + 'ms');
    } catch (err) {
      jsonResponse.error = err.message;
      response.end(JSON.stringify(jsonResponse));
      console.log('[ERROR] ' + err.message);
    }
  }
}

module.exports = Server;

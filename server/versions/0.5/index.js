'use strict';

var Header = require('./siphon/packager/header');
var Client = require('./siphon/packager/client');
var argv = require('yargs').argv;

var usage = 'Usage: --header [--sandbox], --footer --projectPath=/path/to/dir';

if (argv.header && argv.footer) {
  process.stderr.write('--header and --footer are mutually exclusive\n');
  process.exit(1);
} else if (argv.header) {
  // Header construction is not time-critical, so we start node and write the
  // header to stdout all in one go.
  var dev;
  if (argv.dev) {
    var dev = true;
  } else {
    dev = false;
  }

  Header.buildHeader(argv.platform, argv.sandbox, dev);
} else if (argv.footer && argv.projectPath) {
  // Start a server if there isn't one running already
  var client = new Client();
  var start = new Date();
  client.getFooter(argv.projectPath)
    .then((result) => {
      var end = new Date();
      console.log(result);
      console.error('Footer build took ' + (end - start) + 'ms');
    }).catch((err) => {
      console.error(err.message);
    });
} else {
  process.stderr.write(usage + '\n');
  process.exit(1);
}

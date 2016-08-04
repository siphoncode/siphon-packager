
var path = require('path');
var utils = require('./utils');

module.exports = {
  buildHeader: function(platform, sandbox, dev) {
    var headerEntry = 'master.' + platform + '?platform=' + platform +
                      '&dev=' + dev;
    var packagerEnv = sandbox ? 'sandbox-env' : 'production-env';

    var ReactPackager = require('../../' + packagerEnv + '/node_modules/react-native/packager/react-packager');
    var blacklist = require('../../' + packagerEnv + '/node_modules/react-native/packager/blacklist');

    var options = {
      transformModulePath: path.normalize(path.join(__dirname, '../../', packagerEnv, 'node_modules/react-native/packager/transformer.js')),
      projectRoots: [path.join(__dirname, '../../' + packagerEnv)],
      blacklistRE: blacklist(platform),
    };

    ReactPackager.buildPackageFromUrl(options, headerEntry)
      .then((package) => {
        process.stdout.write(package.getSource() + '\n');
      }).catch((err) => {
        process.stderr.write(err.message);
        process.exit(1);
      });
  },
};

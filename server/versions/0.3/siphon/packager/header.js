
var path = require('path');
var utils = require('./utils');

const HEADER_ENTRY = 'master.ios?platform=ios';

module.exports = {
  buildHeader: function(sandbox) {

    var packagerEnv = sandbox ? 'sandbox-env' : 'production-env';

    var ReactPackager = require('../../' + packagerEnv + '/node_modules/react-native/packager/react-packager');
    var blacklist = require('../../' + packagerEnv + '/node_modules/react-native/packager/blacklist');

    var options = {
      transformModulePath: 'react-native/packager/transformer.js',
      projectRoots: [path.join(__dirname, '../../' + packagerEnv)],
      blacklistRE: blacklist('ios'),
    };

    ReactPackager.buildPackageFromUrl(options, HEADER_ENTRY)
      .then((package) => {
        utils.turnDevOff(package);
        
        // dev: true is set below since their own dev: off doesn't quite work
        // in the way we want.
        process.stdout.write(package.getSource({dev: true}) + '\n');
      }).catch((err) => {
        process.stderr.write(err.message);
        process.exit(1);
      });
  },
};

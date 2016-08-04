
// Helper functions for our packager

var constants = require('./constants');
var fs = require('fs');

module.exports = {
  isHeaderModule: function(requireName) {
    var headerModuleNames = Object.keys(constants.HEADER_MODULES);
    if (headerModuleNames.indexOf(requireName) > -1) {
      return true;
    } else {
      return false;
    }
  },

  normalizeDependencyPath: function(path) {
    // You don't need to specify a module's extension in order to require it.
    // So add .js to path if no extension is given.
    var normalizedPath;
    var ext = path.split('.').pop();
    var isAsset = constants.SUPPORTED_ASSETS.indexOf(ext) > -1 ? true : false;

    if (ext !== 'js' && !isAsset) {
      normalizedPath = path + '.js';
    } else {
      normalizedPath = path;
    }

    return normalizedPath;
  },

  isLegalPath: function(path, projectRoot) {
    // Returns false if the path is outside of the project directory
    if (path.slice(0, projectRoot.length) === projectRoot) {
      return true;
    } else {
      return false;
    }
  },

  stringBeginsWith(string, prefixes) {
    // Takes an array of prefixes and checks if the provided string begins with
    // one of them
    var match = false;

    for (var i = 0; i < prefixes.length; i++) {
      if (string.slice(0, prefixes[i].length) === prefixes[i]) {
        match = true;
      }
    }

    return match;
  },

  isFile(path) {
    try {
      return fs.statSync(path).isFile();
    } catch (err) {
      return false;
    }
  },

  isDirectory(path) {
    try {
      return fs.statSync(path).isDirectory();
    } catch (err) {
      return false;
    }
  },
};

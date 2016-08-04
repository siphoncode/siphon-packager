
'use strict';

var Transformer = require('../../production-env/node_modules/react-native/packager/transformer.js');
var precinct = require('precinct');
var fs = require('fs');
var path = require('path');

var Asset = require('./asset.js');
var DependencyResolver = require('./dependency-resolver.js');
var constants = require('./constants.js');
var utils = require('./utils.js');

var UglifyJS = require('uglify-js');

class Module {
  constructor(path, projectRoot) {
    this.name = path.replace(projectRoot + '/', ''); // subdirectory/thing.js
    this.directory = path.substr(0, path.lastIndexOf('/'));
    this.path = path; // my/project/path/subdirectory/thing.js
    this.projectRoot = projectRoot; // my/project/path/
    this._code = this._loadCode(path);
  }

  getDependencyMap() {
    // Returns a map of relative dependency paths: absolute dependency paths
    // for project dependencies (non-header modules)
    var requiredNames = precinct(this._code);
    var depMap = {};

    for (var i = 0; i < requiredNames.length; i++) {
      var candidate = requiredNames[i];

      if (utils.isHeaderModule(candidate)) {
        continue;
      }

      var depResolver = new DependencyResolver(candidate, this.path,
                                                          this.projectRoot);

      var dependencyPath = depResolver.resolveDependency();
      depMap[candidate] = dependencyPath;
    }

    return depMap;
  }

  getDependencies() {
    var depMap = this.getDependencyMap();
    var keys = Object.keys(depMap);
    var deps = [];
    for (var i = 0; i < keys.length; i++) {
      deps.push(depMap[keys[i]]);
    }

    return deps;
  }

  _getType(requireName) {
    // Return the module type for a given required string
    var pathExtension = path.split('.').pop();
    var moduleType;

    return path;
  }

  _processRequires(code) {
    // Replace requires appropriately (absolute path for user's modules, and
    // as per constants.HEADER_MODULES for header modules)
    var replacementMap = Object.assign({}, this.getDependencyMap(),
                                      constants.HEADER_MODULES);
    var requiredNames = Object.keys(replacementMap);

    var processedCode = code;
    for (var i = 0; i < requiredNames.length; i++) {
      // TODO: Look at facebook's way of doing this
      var re  = new RegExp(
        'require\\(\\s{0,}"' + requiredNames[i] + '"\\s{0,}\\)|require\\(\\s{0,}\'' + requiredNames[i] +
        '\'\\s{0,}\\)', 'g');
      var replacement = replacementMap[requiredNames[i]];
      processedCode = processedCode.replace(re, 'require("' + replacement + '")');
    }

    return processedCode;
  }

  _getDependencyPath(relativePath) {
    // TODO: retire this way of doing things and use our dependency resolver
    // instead.
    var absolutePath = path.resolve(this.directory, relativePath);
    var normalized = utils.normalizeDependencyPath(absolutePath);
    return normalized;
  }

  _loadCode(path) {
    var ext = path.split('.').pop();
    var code;
    if (constants.SUPPORTED_ASSETS.indexOf(ext) > -1) {
      var asset = new Asset(path, this.projectRoot);
      var assetObj = asset.getAssetObject();
      code = 'module.exports = require("AssetRegistry").registerAsset(' +
                               JSON.stringify(assetObj) + ');\n';
    } else {
      // Load as a js or json file (whichever is appropriate)

      try {
        var rawCode = fs.readFileSync(path, 'utf8');
      } catch (err) {
        throw new Error('File not found: Requiring \'' + this.requiredName +
                        '\' from ' + this.name);
      }

      if (ext === 'json') {
        try {
          // Parse to make sure it's Kosher json
          var parsed = JSON.parse(rawCode);
          rawCode = 'module.exports = ' + JSON.stringify(parsed);
        } catch (err) {
          throw new Error(this.name + ': ' + err.message);
        }
      }

      // Handle any transformer exceptions
      try {
        code = Transformer.transform(rawCode).code;
      } catch (err) {
        // Strip 'Unknown:' from the error string
        var errMsg = this.name + ': ' + err.message.replace('unknown:', '');
        throw new Error(errMsg);
      }
    }

    return code;
  }

  packageModule(minify) {
    // We need to process the requires and wrap up the code in the __d function
    var template = '__d("%__siphon_module_name%", function(global, require, ' +
                    'module, exports) {%__siphon_module_code%});\n';
    var processed = template.replace('%__siphon_module_name%', this.path);

    // We wrap processedCode in a function; this prevents any special replacement
    // chars in the code (e.g. if the code itself contains $&, or any other
    // special regex chars) performing there usual function.

    var code = this._processRequires(this._code);

    var processedCode = function() {
      return code;
    };

    processed = processed.replace('%__siphon_module_code%', processedCode, 'g');

    if (this.name === 'index.ios.js') {
      processed = processed + ';require("' + this.path + '");';
    }

    if (minify) {
      var minified = UglifyJS.minify(processed, {fromString: true});
      processed = minified.code;
    }

    return processed;
  }
}

module.exports = Module;

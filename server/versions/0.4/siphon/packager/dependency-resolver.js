
'use strict';

var fs = require('fs');
var path = require('path');

var constants = require('./constants');
var utils = require('./utils');
var Options = require('./options');

const optionsDeclaration = {
  requiredName: {
    type: 'string',
    required: true,
  },
  fromPath: {
    type: 'string',
    required: true,
  },
  projectRoot: {
    type: 'string',
    required: true,
  },
  platform: {
    type: 'string',
    required: true,
  },
};

class DependencyResolver {

  constructor(options) {
    // Takes the name of the required module (e.g. './beans' in
    // require('./beans')), the path of the module that required it,
    // and returns the absolute path.
    var opts = Options.validateOptions(optionsDeclaration, options);
    this.requiredName = opts.requiredName;
    this.fromPath = opts.fromPath;
    this.projectRoot = opts.projectRoot;
    this.platform = opts.platform;
  }

  resolveDependency() {
    var filePath;
    var requiredFromName = this.fromPath.replace(this.projectRoot + '/', '');

    if (utils.stringBeginsWith(this.requiredName, ['/', './', '../'])) {
      // This is a user's module
      var absPath = this._absPath(this.requiredName);

      if (!utils.isLegalPath(absPath, this.projectRoot)) {
        throw new Error('Modules can not be imported from outside the ' +
                          'app directory (requiring \'' + this.requiredName
                          + '\' from ' + requiredFromName);
      }

      var ext = path.extname(this.requiredName);
      var isAsset = constants.SUPPORTED_ASSETS.indexOf(ext) > -1 ? true : false;

      if (isAsset) {
        return absPath;
      }

      var loaders = [
        this._loadAsFile.bind(this),
        this._loadAsDirectory.bind(this),
      ];

      for (var i = 0; i < loaders.length; i++) {
        filePath = loaders[i](absPath);
        if (filePath) {
          break;
        }
      }

    } else {
      filePath = this._loadNodeModule(absPath);
    }

    if (filePath) {
      return filePath;
    } else {
      var name = this.fromPath.replace(this.projectRoot, '');
      throw new Error('File not found: Requiring \'' + this.requiredName +
                      '\' from ' + requiredFromName);
    }

  }

  // The methods below take the same names as those in the pseudocode example
  // at https://nodejs.org/api/modules.html#modules_all_together, except in this
  // case we want to load the file name rather than than the contents itself.

  _loadAsFile(absPath) {
    var absJSPath = absPath + '.js';
    var absJSPlatformPath = absPath + '.' + this.platform + '.js';
    var absJSONPath = absPath + '.json';
    var absJSONPlatformPath = absPath + '.' + this.platform + '.json';
    var filePath = this._firstFoundFile([
      absPath,
      absJSPath,
      absJSPlatformPath,
      absJSONPath,
      absJSONPlatformPath,
    ]);
    return filePath;
  }

  _loadAsDirectory(dirPath) {
    if (!utils.isDirectory(dirPath)) {
      return '';
    }

    var platformJSEntry = 'index.' + this.platform + '.js';
    var platformJSONEntry = 'index.' + this.platform + '.json';
    var pkgFile = path.join(dirPath, 'package.json');
    var indexJSFile = path.join(dirPath, 'index.js');
    var indexJSPlatformFile = path.join(dirPath, platformJSEntry);
    var indexJSONFile = path.join(dirPath, 'index.json');
    var indexJSONPlatformFile = path.join(dirPath, platformJSONEntry);

    var filePath = this._firstFoundFile([
      pkgFile,
      indexJSFile,
      indexJSPlatformFile,
      indexJSONFile,
      indexJSONPlatformFile,
    ]);

    if (filePath === pkgFile) {
      // We must check if the file is the package.json file.
      // If it is, we return the specified "main" field.

      var pkgContents = fs.readFileSync(pkgFile);
      var pkgObj = JSON.parse(pkgContents);
      var main = pkgObj.main;
      var browser = pkgObj.browser;

      if (browser && typeof browser == 'string') {
        return path.join(dirPath, browser);
      }

      if (main) {
        return path.join(dirPath, main);
      }
    }

    return filePath;
  }

  _loadNodeModule() {
    var dirs = this._nodeModulePaths();
    for (var i = 0; i < dirs.length; i++) {
      var candidate = path.join(dirs[i], this.requiredName);

      var file = this._loadAsFile(candidate);

      if (file) {
        return file;
      }

      var dir = this._loadAsDirectory(candidate);

      if (dir) {
        return dir;
      }
    }

    return '';
  }

  _absPath(fullName) {
    return path.resolve(path.dirname(this.fromPath), fullName);
  }

  _firstFoundFile(candidates) {
    // Takes an array of candidate paths and returns the first one that is
    // a file.
    for (var i = 0; i < candidates.length; i++) {
      if (utils.isFile(candidates[i])) {
        return candidates[i];
      }
    }

    return '';
  }

  _nodeModulePaths() {
    // Returns a list of paths to inspect for node_modules directory
    var currentDir = path.dirname(this.fromPath);
    var relativeToRoot = currentDir.replace(this.projectRoot, '');
    var parts = relativeToRoot.split(path.sep);
    var nodeModulePaths = [];
    var i = parts.length - 1;

    while (i >= 0) {
      if (parts[i] === 'nodule_modules') {
        continue;
      }

      var joined = parts.join('/') + '/node_modules';
      var dir = path.join(this.projectRoot, joined);
      nodeModulePaths.push(dir);
      parts.pop();
      i = parts.length - 1;
    }

    return nodeModulePaths;
  }
}

module.exports = DependencyResolver;

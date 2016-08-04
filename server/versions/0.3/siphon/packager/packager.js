
'use strict';

// The primary object for packaging
var fs = require('fs');
var path = require('path');

var DependencyGraph = require('./dependency-graph');
var Module = require('./module.js');
var Options = require('./options.js');

const optionsDeclaration = {
  entryPath: {
    type: 'string',
    required: true,
  },
  outputPath: {
    type: 'string',
    required: true,
  },
  minify: {
    type: 'boolean',
    required: false,
    default: true,
  },
};

class Packager {
  constructor(options) {
    var opts = Options.validateOptions(optionsDeclaration, options);
    this._entryPath = opts.entryPath;
    this._outputPath = opts.outputPath;
    this._minify = opts.minify;
    this._projectRoot = opts.entryPath.substr(0, opts.entryPath.lastIndexOf('/'));
    this._modules = {};
    this._dependencyGraph = new DependencyGraph;
  }

  buildFooter() {
    var modulePaths = [this._entryPath];
    var visited = [];

    var currentPath;
    var currentModule;
    var dependencies;

    while (modulePaths.length > 0) {
      currentPath = modulePaths.pop();

      // If we've already visited this module, skip to the next one
      if (visited.indexOf(currentPath) > -1) {
        continue;
      }

      var currentModule = new Module(currentPath, this._projectRoot);
      visited.push(currentPath);
      dependencies = currentModule.getDependencies();

      // Update our module registry
      this._modules[currentPath] = currentModule;

      // Update the dependency graph
      this._dependencyGraph.addNode(currentPath);
      this._dependencyGraph.addChildren(currentPath, dependencies);

      // Update our module paths
      modulePaths = modulePaths.concat(dependencies);
    }

    var orderedDeps = this._dependencyGraph.resolveDependencies();
    var packagedModules = this._packageModules(orderedDeps);

    var outputDir = path.dirname(this._outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(this._outputPath, packagedModules);
    return this._outputPath;
  }

  _packageModules(dependencies) {
    var packaged = '';
    for (var i = 0; i < dependencies.length; i++) {
      var m = this._modules[dependencies[i]];
      packaged =  packaged + m.packageModule(this._minify);
    }

    return packaged;
  }
}

module.exports = Packager;

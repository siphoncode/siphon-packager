
'use strict';

var path = require('path');
var fs = require('fs');
var sizeOf = require('image-size');

class Asset {
  constructor(path, projectRoot) {
    this.path = path;
    this.directory = path.substr(0, path.lastIndexOf('/') + 1);
    this.fileName = path.replace(this.directory, '');

    var fileNameComponents = this.fileName.split('.');
    this.extension = fileNameComponents.pop();
    this.name = fileNameComponents.join('.');
    this.scales = this.getScales();

    this.projectRoot = projectRoot;
    this.relativePath = this.path.replace(projectRoot, '');
  }

  getDimensions() {
    // Get the dimensions of the asset at the given path
    var dimensions = sizeOf(this.path);
    return dimensions;
  }

  getScales() {
    // Get a list of the contents of the asset's directory match
    // path/to/asset/asset@x.png, appending the values of x to our array
    var scales = [1];
    var assetDirContents = fs.readdirSync(this.directory);
    var name = this.fileName.split('.')[0];
    var extension = this.fileName.split('.').pop();

    var doubleRes = name + '@2x.' + this.extension;
    var tripleRes = name + '@3x.' + this.extension;

    if (assetDirContents.indexOf(doubleRes) > -1) {
      scales.push(2);
    }

    if (assetDirContents.indexOf(tripleRes) > -1) {
      scales.push(3);
    }

    return scales;
  }

  getPaths() {
    var dir = '__SIPHON_ASSET_URL/images';
    var p = path.join(dir, this.relativePath);
    var paths = [p];

    for (var i = 1; i < this.scales.length; i++) {
      var re = new RegExp('.' + this.extension);
      paths.push(p.replace(re, '@' + (i + 1) + 'x.' + this.extension));
    }

    return paths;
  }

  getAssetObject() {
    var dimensions = this.getDimensions();
    var dir = '__SIPHON_ASSET_URL/images';
    var relativeDir = this.relativePath.substr(0, this.relativePath.lastIndexOf('/'));
    var serverLocation = '__siphon_assets/images/' + relativeDir;

    return {
      __packager_asset: true,
      fileSystemLocation: dir,
      httpServerLocation: serverLocation,
      width: dimensions.width,
      height: dimensions.height,
      hash: this.path,
      scales: this.scales,
      files: this.getPaths(),
      name: this.name,
      type: this.extension,
    };
  }
};

module.exports = Asset;

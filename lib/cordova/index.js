/*!
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path'),
    cordovaLibPath = path.join(__dirname, '..', '..', 'node_modules', 'cordova', 'node_modules', 'cordova-lib');

// npm 3.x flattens the node_modules/ and moves 'cordova-lib'
// More info at phonegap/phonegap#515
if (!fs.existsSync(cordovaLibPath)) {
    cordovaLibPath = path.join(__dirname, '..', '..', 'node_modules', 'cordova-lib');
}

/**
 * Cordova CLI API.
 *
 * Eventually, it will be replaced by:
 *
 *     require('cordova').cli;
 */

module.exports.cordova = require(cordovaLibPath).cordova;

/**
 * Cordova Lib.
 *
 * Eventually, it will be replaced by:
 *
 *     require('cordova').cordova_lib;
 */

module.exports.lib = require(cordovaLibPath);

// set the binary name of the Cordova CLI to phonegap
module.exports.lib.binname = require(path.join('..', '..', 'package.json')).name;

/**
 * Cordova Utility Module.
 *
 * We should consider exposing this interface in the cordova module.
 */

module.exports.util = require(path.join(cordovaLibPath, 'src', 'cordova', 'util'));

/*!
 * Module dependencies.
 */

var path = require('path'),
    cordovaLibPath = path.join('..', '..', 'node_modules', 'cordova', 'node_modules', 'cordova-lib');

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

/*!
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path');

/**
 * Cordova CLI API.
 */

module.exports.cordova = require('cordova');

/**
 * Cordova Lib.
 */

module.exports.lib = require('cordova').cordova_lib;

// set the binary name of the Cordova CLI to phonegap
module.exports.lib.binname = require(path.join(__dirname, '..', '..', 'package.json')).name;

/**
 * Cordova Utility Module.
 *
 * We should consider exposing this interface in the cordova module.
 *
 * Until then, we will manually define the methods that we need to use.
 */

module.exports.util = {
    isCordova: require('cordova').cordova_lib.cordova.findProjectRoot,

    // borrowed from the apache/cordova-lib utility implementation, since it is
    // not pubicly accessible:
    // https://github.com/apache/cordova-lib/blob/master/cordova-lib/src/cordova/util.js
    listPlatforms: function(project_dir) {
        var platforms_dir = path.join(project_dir, 'platforms');
        if ( !fs.existsSync(platforms_dir)) {
            return [];
        }
        var subdirs = fs.readdirSync(platforms_dir);
        return subdirs;
    }
};

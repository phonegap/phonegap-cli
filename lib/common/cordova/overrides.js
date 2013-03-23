/*!
 * Module dependencies.
 */

var cordova = require('cordova'),
    semver = require('semver'),
    shell = require('shelljs');

/**
 * Minimum SDK versions.
 */
var MIN_XCODE_VERSION = '4.5.x';

/*
 * Cordova Platform Support Polyfill.
 *
 * This should be donated back to the Cordova CLI.
 *
 * Options:
 *
 *   - `platform` {String} is the name of the platform to check.
 *   - `callback` {Function} is triggered with support response.
 *     - `supported` {Boolean} is true if the platform is supported.
 */

cordova.platform.supports = function(platform, callback) {
    cordova.platform.supports[platform](function(supported) {
        callback(supported);
    });
};

/**
 * Check Android SDK Requirements.
 */

cordova.platform.supports.android = function(callback) {
    shell.exec('android list target', { silent:true, async:true }, function(code, output) {
        if (code !== 0) {
            callback(false);
        }
        else if (output.indexOf('android-17') == -1) {
            callback(false);
        }
        else {
            callback(true);
        }
    });
};

/**
 * Check BlackBerry SDK Requirements.
 */

cordova.platform.supports.blackberry = function(callback) {
    shell.exec('which bbwp', { silent:true, async:true }, function(code, output) {
        if (code !== 0) {
            callback(false);
        }
        else {
            callback(true);
        }
    });
};

/**
 * Check iOS SDK Requirements.
 */

cordova.platform.supports.ios = function(callback) {
    shell.exec('xcodebuild -version', { silent:true, async:true }, function(code, output) {
        if (code !== 0) {
            callback(false);
        }
        else {
            var xc_version = output.split('\n')[0].split(' ')[1];

            if (semver.lt(xc_version, MIN_XCODE_VERSION)) {
                callback(false);
            }
            else {
                callback(true);
            }
        }
    });
};

/*!
 * Expose module.
 */

module.exports = cordova;

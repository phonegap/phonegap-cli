/*!
 * Module dependencies.
 */

var cordova = require('./common/cordova/overrides'); // global override

/**
 * PhoneGap object.
 */

function PhoneGap() {
}

/*
 * PhoneGap prototype chain composed of isolated actions.
 */

PhoneGap.prototype.app = require('./phonegap/app');
PhoneGap.prototype.build = require('./phonegap/build');
PhoneGap.prototype.create = require('./phonegap/create');
PhoneGap.prototype.local = {};
PhoneGap.prototype.local.build = require('./phonegap/local/build');
PhoneGap.prototype.remote = {};
PhoneGap.prototype.remote.login = require('./phonegap/remote/login');
PhoneGap.prototype.remote.logout = require('./phonegap/remote/logout');
PhoneGap.prototype.remote.build = require('./phonegap/remote/build');

/*
 * Expose the PhoneGap object.
 */

module.exports = PhoneGap;

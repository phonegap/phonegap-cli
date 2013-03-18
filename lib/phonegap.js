/**
 * PhoneGap object.
 */

function PhoneGap() {
}

/*
 * PhoneGap prototype chain composed of isolated actions.
 */

PhoneGap.prototype.app = require('./phonegap/app');
PhoneGap.prototype.create = require('./phonegap/create');
PhoneGap.prototype.remote = {};
PhoneGap.prototype.remote.login = require('./phonegap/remote/login');
PhoneGap.prototype.remote.logout = require('./phonegap/remote/logout');

/*
 * Expose the PhoneGap object.
 */

module.exports = PhoneGap;

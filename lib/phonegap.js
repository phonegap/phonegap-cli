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

/*
 * Expose the PhoneGap object.
 */

module.exports = PhoneGap;

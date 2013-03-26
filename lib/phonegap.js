/*!
 * Module dependencies.
 */

var PhoneGapBuild = require('phonegap-build'),
    cordova = require('./common/cordova/overrides'), // global override
    events = require('events'),
    util = require('util');

/**
 * PhoneGap object.
 *
 * Events:
 *
 *   - `err` {Event} triggered with info compatible with console.error.
 *   - `log` {Event} triggered with info compatible with console.log.
 *   - `warn` {Event} triggered with info compatible with console.warn.
 *   - `login` {Event} triggered when login credentials are needed.
 *     - `callback` {Function} is triggered with user credentials
 *       - `username` {String}
 *       - `password` {String}
 */

function PhoneGap() {
    events.EventEmitter.call(this);

    // used by methods
    this.phonegapbuild = new PhoneGapBuild();

    // standardize access to the phonegap object as this.phonegap.
    // required for functions to invoke each other in a testable manner.
    this.phonegap = this;
    this.local.phonegap = this;
    this.remote.phonegap = this;
}

/*!
 * Inherit event support.
 */

util.inherits(PhoneGap, events.EventEmitter);

/*!
 * PhoneGap prototype chain composed of isolated actions.
 */

PhoneGap.prototype.app = require('./phonegap/app');
PhoneGap.prototype.build = require('./phonegap/build');
PhoneGap.prototype.create = require('./phonegap/create');
PhoneGap.prototype.local = {};
PhoneGap.prototype.local.build = require('./phonegap/local.build');
PhoneGap.prototype.remote = {};
PhoneGap.prototype.remote.login = require('./phonegap/remote.login');
PhoneGap.prototype.remote.logout = require('./phonegap/remote.logout');
PhoneGap.prototype.remote.build = require('./phonegap/remote.build');

/*!
 * Expose the PhoneGap object.
 */

module.exports = PhoneGap;

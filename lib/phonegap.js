/*!
 * Module dependencies.
 */

var cordova = require('./phonegap/util/cordova'),
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
 *   - `raw` {Event} trigger with info that should not be formatted.
 *   - `login` {Event} triggered when login credentials are needed.
 *     - `callback` {Function} is triggered with user credentials
 *       - `username` {String}
 *       - `password` {String}
 */

function PhoneGap() {
    // initialize each command and inject the `phonegap` dependency.
    this.app = require('./phonegap/app').init(this);
    this.build = require('./phonegap/build').init(this);
    this.create = require('./phonegap/create').init(this);
    this.local.build = require('./phonegap/local.build').init(this);
    this.remote.build = require('./phonegap/remote.build').init(this);
    this.remote.login = require('./phonegap/remote.login').init(this);
    this.remote.logout = require('./phonegap/remote.logout').init(this);
}

util.inherits(PhoneGap, events.EventEmitter);

/*!
 * PhoneGap prototype chain.
 */

PhoneGap.prototype.local = {};
PhoneGap.prototype.remote = {};

/*!
 * Expose the PhoneGap object.
 */

module.exports = new PhoneGap();

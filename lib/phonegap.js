/*!
 * Module dependencies.
 */

var cordova = require('./phonegap/util/cordova'),
    emitter = require('./phonegap/util/emitter'),
    bind = require('./phonegap/util/bind');

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
    // standardize access to the phonegap object as this.phonegap.
    // required for functions to invoke each other in a testable manner.
    this.phonegap = this;
    this.local.phonegap = this;
    this.remote.phonegap = this;

    // initialize each command and inject the `phonegap` dependency.
    this.app = require('./phonegap/app').init(this);
    this.build = require('./phonegap/build').init(this);
    this.create = require('./phonegap/create').init(this);
    this.local.build = require('./phonegap/local.build').init(this);
    this.remote.build = require('./phonegap/remote.build').init(this);
    this.remote.login = require('./phonegap/remote.login').init(this);
    this.remote.logout = require('./phonegap/remote.logout').init(this);
}

/*!
 * PhoneGap prototype chain composed of isolated actions.
 */

PhoneGap.prototype.local = {};
PhoneGap.prototype.remote = {};

/*!
 * Expose the PhoneGap object.
 */

var phonegap = new PhoneGap();
bind(emitter, phonegap);

module.exports = phonegap;

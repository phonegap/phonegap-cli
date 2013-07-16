/*!
 * Module dependencies.
 */

var phonegapbuild = require('phonegap-build'),
    events = require('events'),
    util = require('util');

/**
 * PhoneGap object.
 *
 * Events:
 *
 *   - `error` {Event} triggered with info compatible with console.error.
 *     - `e` {Error} describes the error.
 *   - `log` {Event} triggered with info compatible with console.log.
 *   - `warn` {Event} triggered with info compatible with console.warn.
 *   - `raw` {Event} trigger with info that should not be formatted.
 *   - `login` {Event} triggered when login credentials are needed.
 *     - `callback` {Function} is triggered with user credentials
 *       - `username` {String}
 *       - `password` {String}
 */

function PhoneGap() {
    // initialize PhoneGap
    initialize.call(this);

    // initialize each command and inject the `phonegap` dependency.
    this.app = require('./phonegap/app').create(this);
    this.build = require('./phonegap/build').create(this);
    this.create = require('./phonegap/create').create(this);
    this.install = require('./phonegap/install').create(this);
    this.local.build = require('./phonegap/local.build').create(this);
    this.local.install = require('./phonegap/local.install').create(this);
    this.local.plugin.add = require('./phonegap/local.plugin.add').create(this);
    this.local.plugin.list = require('./phonegap/local.plugin.list').create(this);
    this.local.plugin.remove = require('./phonegap/local.plugin.remove').create(this);
    this.local.run = require('./phonegap/local.run').create(this);
    this.mode = require('./phonegap/mode').create(this);
    this.remote.build = require('./phonegap/remote.build').create(this);
    this.remote.install = require('./phonegap/remote.install').create(this);
    this.remote.login = require('./phonegap/remote.login').create(this);
    this.remote.logout = require('./phonegap/remote.logout').create(this);
    this.remote.run = require('./phonegap/remote.run').create(this);
    this.run = require('./phonegap/run').create(this);
    this.version = require('./phonegap/version').create(this);

    // set normal mode (not verbose and not quiet)
    this.mode({ verbose: false });
}

util.inherits(PhoneGap, events.EventEmitter);

/*!
 * PhoneGap prototype chain.
 */

PhoneGap.prototype.local = {};
PhoneGap.prototype.local.plugin = {};
PhoneGap.prototype.remote = {};

/*!
 * Initialize PhoneGap.
 */

function initialize() {
    var self = this;

    // error events must always have a listener.
    self.on('error', function(e) {});

    // reset all phonegapbuild event listeners
    phonegapbuild.removeAllListeners();
}

/*!
 * Expose the PhoneGap object.
 */

module.exports = PhoneGap;

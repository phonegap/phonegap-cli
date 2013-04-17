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
    this.app = require('./phonegap/app').init(this);
    this.build = require('./phonegap/build').init(this);
    this.create = require('./phonegap/create').init(this);
    this.run = require('./phonegap/run').init(this);
    this.local.build = require('./phonegap/local.build').init(this);
    this.local.run = require('./phonegap/local.run').init(this);
    this.remote.build = require('./phonegap/remote.build').init(this);
    this.remote.login = require('./phonegap/remote.login').init(this);
    this.remote.logout = require('./phonegap/remote.logout').init(this);
    this.remote.run = require('./phonegap/remote.run').init(this);
}

util.inherits(PhoneGap, events.EventEmitter);

/*!
 * PhoneGap prototype chain.
 */

PhoneGap.prototype.local = {};
PhoneGap.prototype.remote = {};

/*!
 * Initialize PhoneGap.
 */

function initialize() {
    var self = this;

    // error events must always have a listener.
    self.on('error', function(e) {});

    // reset the listeners on the a new PhoneGap instance
    phonegapbuild.removeAllListeners();

    // map events from PhoneGapBuild to PhoneGap
    phonegapbuild.on('log', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('log');
        self.emit.apply(self, args);
    });

    phonegapbuild.on('warn', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('warn');
        self.emit.apply(self, args);
    });

    phonegapbuild.on('error', function(e) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('error');
        self.emit.apply(self, args);
    });

    phonegapbuild.on('raw', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('raw');
        self.emit.apply(self, args);
    });
}

/*!
 * Expose the PhoneGap object.
 */

module.exports = PhoneGap;

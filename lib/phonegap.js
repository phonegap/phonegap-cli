/*!
 * Module dependencies.
 */

var phonegapbuild = require('phonegap-build'),
    events = require('events'),
    util = require('util'),
    path = require('path'),
    fs = require('fs'),
    cordovaDependency = require('phonegap-cordova-dependence');

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
    this.cordova = require('./phonegap/cordova').create(this);
    this.create = require('./phonegap/create').create(this);
    this.mode = require('./phonegap/mode').create(this);
    this.template.list = require('./phonegap/template.list').create(this);
    this.template.search = require('./phonegap/template.search').create(this);
    this.remote.build = require('./phonegap/remote.build').create(this);
    this.remote.install = require('./phonegap/remote.install').create(this);
    this.remote.login = require('./phonegap/remote.login').create(this);
    this.remote.logout = require('./phonegap/remote.logout').create(this);
    this.remote.run = require('./phonegap/remote.run').create(this);
    this.serve = require('./phonegap/serve').create(this);
    this.app = this.serve;
    this.version = require('./phonegap/version').create(this);
    this.push = require('./phonegap/push').create(this);
    this.share = require('./phonegap/share').create(this);

    // set normal mode (not verbose and not quiet)
    this.mode({ verbose: false });

    var self = this;
    self.util = {};
    var cordovaSaved;

    /* ToDo: @carynbear FIX THIS! was originally a require of cordova, changed to dynamically load the project's cordova; DIRTY
        Main usage of this property is within serve. connect-phonegap will be passed the phonegap object and will call through to this
        Because this is a dynamic getter, we must access it before calling connect-phonegap to load it. Then we must delay the call to connect-phonegap
        because the properties of the require are also dynamically loaded after the export.
    */
    Object.defineProperty(self.util, 'cordova',
    {
        get: function () {
            if (cordovaSaved) {
                return cordovaSaved;
            } 
            return cordovaDependency.exec(undefined, self)
                .then(function(projectPath){
                    var nodeModules = path.join(projectPath, 'node_modules');
                    var cordovaPath = path.join(path.join(nodeModules, 'cordova'));
                    if (!fs.existsSync(nodeModules)) {
                        cordovaSaved = undefined;
                        e = new Error('node_modules not found; need to run npm install');
                        self.emit('error', e.message);
                        throw e;
                    } else if (!fs.existsSync(cordovaPath)) {
                        cordovaSaved = undefined;
                        e = new Error('Cordova not found in project; run "npm install cordova"');
                        self.emit('error', e.message);
                        throw e;
                    } else {
                        var cordova = require(cordovaPath);
                        cordovaSaved = cordova;
                        return cordova;
                    }
                });
        }
    });
}

util.inherits(PhoneGap, events.EventEmitter);

/*!
 * PhoneGap prototype chain.
 */

PhoneGap.prototype.remote = {};
PhoneGap.prototype.template = {};

/*!
 * Initialize PhoneGap.
 */

function initialize() {
    var self = this;

    // error events must always have a listener.
    // this should be an empty listener that quietly captures errors.
    // users can also subscribe to the error event to receive and handle it.
    self.on('error', function(e) {});

    // reset all phonegapbuild event listeners
    phonegapbuild.removeAllListeners();
}

/*!
 * Expose the PhoneGap object.
 */

module.exports = PhoneGap;

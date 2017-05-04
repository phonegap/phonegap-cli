/*!
 * Module dependencies.
 */

var Command         = require('./util/command'),
    cordova         = require('../cordova').cordova,
    project         = require('./util/project'),
    server          = require('connect-phonegap'),
    proxy           = require('./util/connect-proxy'),
    util            = require('util');

/**
 * Server Default Settings
 */
var ServeDefaults = {
    port: 3000,
    autoreload: true,
    browser: true,
    console: true,
    deploy: true,
    homepage: true,
    localtunnel: false,
    proxy: true,
    push: true,
    refresh: true,
    connect: false
};

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new AppCommand(phonegap);
    },
    default_settings: ServeDefaults
};

function AppCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(AppCommand, Command);

/**
 * Serve the App.
 *
 * Creates a local server to serve up the project. The intended
 * receiver is the PhoneGap App but any browser can consume the
 * content.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `[port]` {Number} is the server port (default: 3000).
 *     - `[autoreload]` {Boolean} refreshes app on file system changes (default: true)
 *   - `[callback]` {Function} is triggered when server starts.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

AppCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');

    // optional parameters
    options.port = options.port || ServeDefaults.port;
    options.autoreload = (typeof options.autoreload === 'boolean') ? options.autoreload : ServeDefaults.autoreload;
    options.browser = (typeof options.browser === 'boolean') ? options.browser : ServeDefaults.browser;
    options.console = (typeof options.console === 'boolean') ? options.console : ServeDefaults.console;
    options.deploy = (typeof options.deploy === 'boolean') ? options.deploy : ServeDefaults.deploy;
    options.homepage = (typeof options.homepage === 'boolean') ? options.homepage : ServeDefaults.homepage;
    options.localtunnel = (typeof options.localtunnel === 'boolean') ? options.localtunnel : ServeDefaults.localtunnel;
    options.proxy = (typeof options.proxy === 'boolean') ? options.proxy : ServeDefaults.proxy;
    options.push = (typeof options.push === 'boolean') ? options.push : ServeDefaults.push;
    options.refresh = (typeof options.refresh === 'boolean') ? options.refresh : ServeDefaults.refresh;
    options.connect = (typeof options.connect === 'boolean') ? options.connect : ServeDefaults.connect;
    options.phonegap = this.phonegap;
    callback = callback || function() {};

    // start app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute command.
 */

AppCommand.prototype.execute = function(options, callback) {
    var self = this;

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    var _errorHandler = function(err) {
        self.phonegap.emit('error', err);
        callback(err);
    };

    /**
     * Start Server
     */
    var startServer = function (self, options) {
        self.phonegap.emit('log', 'starting app server...');

        server.listen(options)
              .on('browserAdded', function() {
                  self.phonegap.emit('browserAdded');
              })
              .on('deviceConnected', function() {
                  self.phonegap.emit('deviceConnected');
              })
              .on('error', _errorHandler)
              .on('log', function(statusCode, url) {
                  self.phonegap.emit('log', statusCode, url);
              })
              .on('update', function(c) {
                  if(options.connect === true) proxy.uploadUpdatedZip(options);
              })
              .on('complete', function(data) {
                  callback(null, data);
                  if(options.connect === true) proxy.uploadAppZip(options);
              });
    };

    // prepare to execute appropriate cordova hooks
    // try because cordova is shitting the bed on promise fulfillment
    try {
        cordova.prepare([], function(err, data) {
            startServer(self, options);
        });
    } catch (e) {
        startServer(self, options);
    }
};

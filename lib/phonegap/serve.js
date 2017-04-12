/*!
 * Module dependencies.
 */
var Command         = require('./util/command'),
    cordova         = require('../cordova').cordova,
    project         = require('./util/project'),
    server          = require('connect-phonegap'),
    proxy           = require('./util/connect-proxy'),
    fs              = require('fs'),
    path            = require('path'),
    util            = require('util'),
    gaze            = require('gaze');

/**cd testSer
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

    /**
     * Start Server
     */
    var startWatchandServe = function() {
        startWatch(options, callback ,self);
    };

    if(options.browser) {
        addBrowser(startWatchandServe,self);
    } else {
        startWatch( options, callback, self);
    }
};

function startWatch(data, callback, self) {
    // add gaze instance to data(options)
    var watches = [path.join(process.cwd(), 'www/**/*')];
    var watch = new gaze.Gaze(watches);
    data.watch = watch;
    var _errorHandler = function(err) {
        self.phonegap.emit('error', err);
        callback(err);
    };

    watch.on('ready', function(watcher) {
        self.phonegap.emit('log', 'starting app server...');

        server.listen(data)
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
                  if(data.connect === true) proxy.uploadUpdatedZip(data);
              })
              .on('complete', function(data) {
                  callback(null, data);
                  if(data.connect === true) proxy.uploadAppZip(data);
              });
    });
}


function addBrowser(callback,self) {
    if (!fs.existsSync(path.join(process.cwd(), 'platforms/browser'))) {
        var cordovaCommand = 'cordova platform add browser';
        // use cordova to prepare the project from the command-line
        self.phonegap.cordova({ cmd: cordovaCommand }, callback);

    }
    else {
        callback();
    }
}
